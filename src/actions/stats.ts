"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

export interface UserStatsData {
  user: {
    id: string;
    username: string;
    name: string | null;
    createdAt: Date;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    learnings: number;
    uniqueCategories: number;
    beginnerCount: number;
    intermediateCount: number;
    advancedCount: number;
  };
  badgesEarned: number;
  recentBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    criteria: unknown;
    points: number;
    createdAt: Date;
    earnedAt: Date;
  }>;
}

export interface TimelineData {
  date: string;
  count: number;
  beginner: number;
  intermediate: number;
  advanced: number;
}

export interface CategoryBreakdownData {
  name: string;
  color: string;
  count: number;
  percentage: number;
}

export interface LearningInsightsData {
  mostProductiveDay: string;
  avgItemsPerWeek: number;
  consistencyScore: number;
  totalItems: number;
}

/**
 * Fetches comprehensive user statistics including gamification data and badges.
 * @returns ActionResponse with user stats, badges earned, and recent badges
 */
export async function getUserStats(): Promise<ActionResponse<UserStatsData>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        total_points: true,
        current_streak: true,
        longest_streak: true,
        learnings: true,
        uniqueCategories: true,
        beginnerCount: true,
        intermediateCount: true,
        advancedCount: true,
      },
    });

    if (!user) {
      return { status: "ERROR", error: "User not found" };
    }

    // Get badges count
    const badgesEarned = await prisma.userBadge.count({
      where: { userId: session.user.id },
    });

    // Get recent badges with full badge details
    const recentBadges = await prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            category: true,
            criteria: true,
            points: true,
            createdAt: true,
          },
        },
      },
      orderBy: { earnedAt: "desc" },
      take: 5,
    });

    const formattedBadges = recentBadges.map((rb) => ({
      ...rb.badge,
      category: rb.badge.category as string,
      earnedAt: rb.earnedAt,
    }));

    return {
      status: "SUCCESS",
      data: {
        user,
        badgesEarned,
        recentBadges: formattedBadges,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { status: "ERROR", error: "Failed to fetch user statistics" };
  }
}

/**
 * Fetches learning timeline data for the specified number of days.
 * Groups items by date and difficulty level.
 * @param days - Number of days to look back (default: 30)
 * @returns ActionResponse with timeline data array
 */
export async function getLearningTimeline(
  days: number = 30,
): Promise<ActionResponse<TimelineData[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const items = await prisma.item.findMany({
      where: {
        userId: session.user.id,
        date_added: { gte: startDate },
      },
      select: {
        date_added: true,
        difficulty: true,
      },
      orderBy: { date_added: "asc" },
    });

    // Group by date
    const timeline = items.reduce(
      (acc, item) => {
        const date = new Date(item.date_added).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
            beginner: 0,
            intermediate: 0,
            advanced: 0,
          };
        }
        acc[date].count++;
        if (item.difficulty === "Beginner") acc[date].beginner++;
        if (item.difficulty === "Intermediate") acc[date].intermediate++;
        if (item.difficulty === "Advanced") acc[date].advanced++;
        return acc;
      },
      {} as Record<string, TimelineData>,
    );

    return {
      status: "SUCCESS",
      data: Object.values(timeline),
    };
  } catch (error) {
    console.error("Error fetching learning timeline:", error);
    return { status: "ERROR", error: "Failed to fetch learning timeline" };
  }
}

/**
 * Fetches category breakdown with item counts and percentages.
 * @returns ActionResponse with category distribution data
 */
export async function getCategoryBreakdown(): Promise<
  ActionResponse<CategoryBreakdownData[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const categories = await prisma.item.groupBy({
      by: ["categoryId"],
      where: { userId: session.user.id },
      _count: true,
    });

    const categoryData = await Promise.all(
      categories.map(async (cat) => {
        const category = await prisma.category.findUnique({
          where: { id: cat.categoryId },
          select: { name: true, color: true },
        });
        return {
          name: category?.name || "Unknown",
          color: category?.color || "#6366f1",
          count: cat._count,
        };
      }),
    );

    const total = categoryData.reduce((sum, cat) => sum + cat.count, 0);

    return {
      status: "SUCCESS",
      data: categoryData.map((cat) => ({
        ...cat,
        percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    return { status: "ERROR", error: "Failed to fetch category breakdown" };
  }
}

/**
 * Fetches learning insights including productive days, averages, and consistency score.
 * @returns ActionResponse with insights data
 */
export async function getLearningInsights(): Promise<
  ActionResponse<LearningInsightsData>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const items = await prisma.item.findMany({
      where: { userId: session.user.id },
      select: { date_added: true },
    });

    if (items.length === 0) {
      return {
        status: "SUCCESS",
        data: {
          mostProductiveDay: "N/A",
          avgItemsPerWeek: 0,
          consistencyScore: 0,
          totalItems: 0,
        },
      };
    }

    // Most productive day of week
    const dayOfWeekCounts = items.reduce(
      (acc, item) => {
        const day = new Date(item.date_added).getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const mostProductiveDay =
      days[
        (Object.entries(dayOfWeekCounts).sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] as unknown as number) ?? 0
      ] || "N/A";

    // Items per week average
    const firstItemDate = new Date(items[0].date_added);
    const weeksActive = Math.max(
      1,
      Math.ceil(
        (Date.now() - firstItemDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      ),
    );
    const avgItemsPerWeek = Math.round(items.length / weeksActive);

    // Consistency score (based on streak consistency)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { current_streak: true, longest_streak: true, learnings: true },
    });

    const consistencyScore = user
      ? Math.min(
          100,
          Math.round(
            (user.longest_streak > 0
              ? (user.current_streak / user.longest_streak) * 50
              : 0) + (user.learnings > 0 ? 50 : 0),
          ),
        )
      : 0;

    return {
      status: "SUCCESS",
      data: {
        mostProductiveDay,
        avgItemsPerWeek,
        consistencyScore,
        totalItems: items.length,
      },
    };
  } catch (error) {
    console.error("Error fetching learning insights:", error);
    return { status: "ERROR", error: "Failed to fetch learning insights" };
  }
}
