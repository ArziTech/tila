import prisma from "@/lib/prisma";

/**
 * Point calculation constants for various activities
 */
export const POINTS = {
  CREATE_ITEM: 10,
  COMPLETE_ITEM: 100,
  COMPLETE_TODO: 25,
  DAILY_STREAK: 5,
} as const;

/**
 * Difficulty multipliers for point calculation
 */
export const DIFFICULTY_MULTIPLIER = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
} as const;

/**
 * Valid difficulty levels
 */
export type DifficultyLevel = keyof typeof DIFFICULTY_MULTIPLIER;

/**
 * Calculates points for completing an item based on its difficulty
 * @param difficulty - The difficulty level of the item
 * @returns Points awarded for completion
 */
export function calculateItemPoints(difficulty: string): number {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty as DifficultyLevel] || 1.0;
  return Math.round(POINTS.COMPLETE_ITEM * multiplier);
}

/**
 * Awards points to a user by updating their total_points
 * Uses a transaction to ensure atomicity
 * @param userId - The user ID to award points to
 * @param points - Number of points to award
 */
export async function awardPoints(
  userId: string,
  points: number,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      total_points: {
        increment: points,
      },
    },
  });
}

/**
 * Checks if the user already has activity today
 * @param userId - The user ID to check
 * @returns true if the user has activity today, false otherwise
 */
async function hasActivityToday(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { last_activity_date: true },
  });

  if (!user?.last_activity_date) {
    return false;
  }

  const today = new Date();
  const lastActivity = new Date(user.last_activity_date);

  // Compare dates (ignoring time)
  return (
    today.getFullYear() === lastActivity.getFullYear() &&
    today.getMonth() === lastActivity.getMonth() &&
    today.getDate() === lastActivity.getDate()
  );
}

/**
 * Checks if the user's last activity was yesterday
 * @param userId - The user ID to check
 * @returns true if the user's last activity was yesterday, false otherwise
 */
async function hasActivityYesterday(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { last_activity_date: true },
  });

  if (!user?.last_activity_date) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActivity = new Date(user.last_activity_date);
  lastActivity.setHours(0, 0, 0, 0);

  return lastActivity.getTime() === yesterday.getTime();
}

/**
 * Updates the user's activity date to today
 * @param userId - The user ID to update
 */
export async function updateActivityDate(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      last_activity_date: new Date(),
    },
  });
}

/**
 * Updates the user's streak based on their activity
 * Rules:
 * - If last activity was today: do nothing
 * - If last activity was yesterday: increment current_streak
 * - If last activity was >1 day ago: reset current_streak to 1
 * - If current_streak > longest_streak: update longest_streak
 * @param userId - The user ID to update
 */
export async function updateStreak(userId: string): Promise<void> {
  const hasToday = await hasActivityToday(userId);
  const hasYesterday = await hasActivityYesterday(userId);

  if (hasToday) {
    // Already had activity today, don't increment streak
    console.log(`[Gamification] User ${userId} already has activity today`);
    return;
  }

  if (hasYesterday) {
    // Consecutive day, increment streak
    console.log(`[Gamification] User ${userId} has consecutive day activity`);
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { current_streak: true, longest_streak: true },
      });

      if (!user) return;

      const newCurrentStreak = user.current_streak + 1;
      const newLongestStreak = Math.max(user.longest_streak, newCurrentStreak);

      await tx.user.update({
        where: { id: userId },
        data: {
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_activity_date: new Date(),
        },
      });

      console.log(
        `[Gamification] User ${userId} streak updated: ${newCurrentStreak} (longest: ${newLongestStreak})`,
      );
    });
  } else {
    // Streak broken or first activity, reset to 1
    console.log(
      `[Gamification] User ${userId} starting new streak (previous streak broken)`,
    );
    await prisma.user.update({
      where: { id: userId },
      data: {
        current_streak: 1,
        last_activity_date: new Date(),
      },
    });
  }
}

/**
 * Updates the difficulty count for a user
 * Increments the appropriate field based on item difficulty
 * @param userId - The user ID to update
 * @param difficulty - The difficulty level of the completed item
 */
export async function updateDifficultyCount(
  userId: string,
  difficulty: string,
): Promise<void> {
  const field = difficulty === "advanced" ? "advancedCount" :
    difficulty === "intermediate" ? "intermediateCount" :
    "beginnerCount";

  await prisma.user.update({
    where: { id: userId },
    data: {
      [field]: {
        increment: 1,
      },
    },
  });
}

/**
 * Updates the unique category count for a user
 * Counts the number of unique categories the user has items in
 * @param userId - The user ID to update
 */
export async function updateCategoryCount(userId: string): Promise<void> {
  const result = await prisma.item.groupBy({
    by: ["categoryId"],
    where: { userId },
  });

  const uniqueCategories = result.length;

  await prisma.user.update({
    where: { id: userId },
    data: {
      uniqueCategories,
    },
  });
}

/**
 * Checks and updates the user's daily streak
 * This is a convenience function that combines activity date checking
 * and streak updating in a single call
 * @param userId - The user ID to check and update
 */
export async function checkAndUpdateDailyStreak(userId: string): Promise<void> {
  const hasToday = await hasActivityToday(userId);

  if (!hasToday) {
    // Only update streak if no activity today yet
    await updateStreak(userId);
  } else {
    // Still update the activity date to the current time
    await updateActivityDate(userId);
  }
}

/**
 * Awards points and updates streak for completing an item
 * This is a convenience function that combines multiple updates in a transaction
 * @param userId - The user ID to update
 * @param difficulty - The difficulty level of the completed item
 * @param points - Points to award (optional, will be calculated if not provided)
 */
export async function awardCompletionRewards(
  userId: string,
  difficulty: string,
  points?: number,
): Promise<void> {
  const pointsToAward = points ?? calculateItemPoints(difficulty);

  await prisma.$transaction(async (tx) => {
    // Award points
    await tx.user.update({
      where: { id: userId },
      data: {
        total_points: {
          increment: pointsToAward,
        },
        learnings: {
          increment: 1,
        },
      },
    });

    // Update difficulty count
    const field = difficulty === "advanced" ? "advancedCount" :
      difficulty === "intermediate" ? "intermediateCount" :
      "beginnerCount";

    await tx.user.update({
      where: { id: userId },
      data: {
        [field]: {
          increment: 1,
        },
      },
    });

    // Update category count
    const categoryResult = await tx.item.groupBy({
      by: ["categoryId"],
      where: { userId },
    });

    const uniqueCategories = categoryResult.length;

    await tx.user.update({
      where: { id: userId },
      data: {
        uniqueCategories,
      },
    });

    // Update streak
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { last_activity_date: true, current_streak: true, longest_streak: true },
    });

    if (!user) return;

    const today = new Date();
    const lastActivity = user.last_activity_date ? new Date(user.last_activity_date) : null;

    let newCurrentStreak = user.current_streak;
    let newLongestStreak = user.longest_streak;

    if (lastActivity) {
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const lastActivityDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      if (lastActivityDate.getTime() === todayDate.getTime()) {
        // Already had activity today, don't increment streak
        console.log(`[Gamification] User ${userId} already has activity today, skipping streak increment`);
      } else if (lastActivityDate.getTime() === yesterdayDate.getTime()) {
        // Consecutive day
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
        console.log(`[Gamification] User ${userId} streak incremented to ${newCurrentStreak}`);
      } else {
        // Streak broken
        newCurrentStreak = 1;
        console.log(`[Gamification] User ${userId} streak reset to 1`);
      }
    } else {
      // First activity
      newCurrentStreak = 1;
      console.log(`[Gamification] User ${userId} first activity, streak set to 1`);
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: new Date(),
      },
    });

    console.log(
      `[Gamification] Awarded ${pointsToAward} points to user ${userId} for completing ${difficulty} item`,
    );
  });
}
