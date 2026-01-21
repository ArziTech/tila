"use server";

import { auth } from "@/auth";
import type { Item, User } from "@/generated/prisma/client"; // Ensure these imports are correct
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

// Define a type for daily activity data
export interface DailyActivity {
  date: string; // Format: YYYY-MM-DD
  points: number;
  itemsCount: number;
}

// Define a type for the dashboard data
interface DashboardData {
  user: User;
  items: Item[];
  stats: {
    currentStreak: number;
    todayHours: number;
    totalHours: number;
    totalLogs: number;
    level: number;
  };
  dailyActivity: DailyActivity[];
}

/**
 * Calculates learning statistics based on a user's items and profile data.
 * @param user The authenticated user object from the database.
 * @param items A list of learning items associated with the user.
 * @returns An object containing various learning statistics.
 */
function calculateLearningStats(user: User, items: Item[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of today for comparison

  // Calculate hours spent today
  const todayHours =
    items
      .filter((item) => new Date(item.date_added) >= today)
      .reduce((acc, item) => acc + item.duration_minutes, 0) / 60;

  // Calculate total hours spent
  const totalHours =
    items.reduce((acc, item) => acc + item.duration_minutes, 0) / 60;

  return {
    currentStreak: user.current_streak,
    todayHours,
    totalHours,
    totalLogs: items.length,
    level: Math.floor(user.total_points / 1000), // Assuming level is based on total points
  };
}

/**
 * Fetches all necessary data for the user's dashboard.
 * This includes user details, their learning items, and calculated learning statistics.
 * @returns An ActionResponse containing the dashboard data or an error message.
 */
export async function getDashboardData(): Promise<
  ActionResponse<DashboardData>
> {
  try {
    // 1. Authenticate the user session using NextAuth.
    const session = await auth();

    // 2. Check if the user is authenticated and has an ID.
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // 3. Fetch detailed user information from the database using their session ID.
    // This includes profile-specific data like streaks and total points.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // 4. Handle case where user is not found in the database.
    if (!user) {
      return { status: "ERROR", error: "User not found" };
    }

    // 5. Fetch all learning items associated with the authenticated user.
    const items = await prisma.item.findMany({
      where: { userId: user.id },
    });

    // 6. Fetch daily activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivities = await prisma.dailyActivity.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Format daily activity for the chart
    const dailyActivity: DailyActivity[] = dailyActivities.map((activity) => ({
      date: activity.date.toISOString().split("T")[0], // YYYY-MM-DD
      points: activity.points,
      itemsCount: activity.itemsCount,
    }));

    // 7. Calculate various learning statistics based on fetched user and item data.
    const stats = calculateLearningStats(user, items);

    // 8. Return the aggregated dashboard data.
    return {
      status: "SUCCESS",
      data: { user, items, stats, dailyActivity },
    };
  } catch (error) {
    // 8. Log and return a generic error message if an unexpected error occurs.
    console.error("Error fetching dashboard data:", error);
    return { status: "ERROR", error: "Failed to fetch dashboard data" };
  }
}

export async function getProfilePageData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { status: "ERROR", error: "User not found" };
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    const items = await prisma.item.findMany({
      where: { userId: user.id },
    });

    const advancedCount = items.filter(
      (item) => item.difficulty === "Advanced",
    ).length;
    const intermediateCount = items.filter(
      (item) => item.difficulty === "Intermediate",
    ).length;
    const beginnerCount = items.filter(
      (item) => item.difficulty === "Beginner",
    ).length;

    const stats = {
      totalPoints: user.total_points,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
      learnings: items.length,
      uniqueCategories: categories.length,
      advancedCount,
      intermediateCount,
      beginnerCount,
    };

    return {
      status: "SUCCESS",
      data: { user, stats },
    };
  } catch (error) {
    console.error("Error fetching profile page data:", error);
    return { status: "ERROR", error: "Failed to fetch profile page data" };
  }
}
