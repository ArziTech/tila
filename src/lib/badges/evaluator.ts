import prisma from '@/lib/prisma';
import { BADGE_DEFINITIONS } from './definitions';
import type { BadgeCriteria } from './types';

interface UserStats {
  learnings: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  uniqueCategories: number;
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
}

interface EvaluationResult {
  awardedBadges: Array<{
    id: string;
    name: string;
    points: number;
  }>;
  totalPointsEarned: number;
}

export async function evaluateUserBadges(userId: string): Promise<EvaluationResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      learnings: true,
      total_points: true,
      current_streak: true,
      longest_streak: true,
      uniqueCategories: true,
      beginnerCount: true,
      intermediateCount: true,
      advancedCount: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeId));

  const newBadges: Array<{ id: string; name: string; points: number }> = [];
  let totalPointsEarned = 0;

  for (const badgeDef of BADGE_DEFINITIONS) {
    if (earnedBadgeIds.has(badgeDef.id)) continue;

    if (checkCriteria(user, badgeDef.criteria)) {
      const result = await awardBadgeToUser(userId, badgeDef.id);

      if (result.success) {
        newBadges.push({
          id: badgeDef.id,
          name: badgeDef.name,
          points: badgeDef.points,
        });
        totalPointsEarned += badgeDef.points;
      }
    }
  }

  return {
    awardedBadges: newBadges,
    totalPointsEarned,
  };
}

async function awardBadgeToUser(
  userId: string,
  badgeId: string
): Promise<{ success: boolean }> {
  try {
    await prisma.$transaction(async (tx) => {
      const badge = await tx.badge.findUnique({
        where: { id: badgeId },
      });

      if (!badge) {
        throw new Error('Badge not found');
      }

      await tx.userBadge.create({
        data: {
          userId,
          badgeId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          total_points: {
            increment: badge.points,
          },
        },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false };
    }
    throw error;
  }
}

function checkCriteria(userStats: UserStats, criteria: BadgeCriteria): boolean {
  for (const [key, value] of Object.entries(criteria)) {
    if (userStats[key as keyof UserStats] < value) {
      return false;
    }
  }
  return true;
}

export async function getUserBadgesWithProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      learnings: true,
      total_points: true,
      current_streak: true,
      longest_streak: true,
      uniqueCategories: true,
      beginnerCount: true,
      intermediateCount: true,
      advancedCount: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });

  const earnedBadgeIds = new Set(earnedBadges.map((eb) => eb.badgeId));

  const badgesWithProgress = BADGE_DEFINITIONS.map((badgeDef) => {
    const earned = earnedBadgeIds.has(badgeDef.id);
    const criteriaKey = Object.keys(badgeDef.criteria)[0] as keyof typeof user;
    const required = badgeDef.criteria[criteriaKey] as number;
    const current = user[criteriaKey] || 0;
    const percentage = Math.min(100, Math.round((current / required) * 100));

    return {
      ...badgeDef,
      earned,
      earnedAt: earned ? earnedBadges.find((eb) => eb.badgeId === badgeDef.id)!.earnedAt : null,
      progress: {
        current,
        required,
        percentage,
      },
    };
  });

  const earnedBadgesWithDetails = badgesWithProgress.filter((b) => b.earned);
  const availableBadges = badgesWithProgress.filter((b) => !b.earned);

  return {
    earnedBadges: earnedBadgesWithDetails,
    availableBadges,
    totalEarned: earnedBadgesWithDetails.length,
    totalAvailable: availableBadges.length,
  };
}
