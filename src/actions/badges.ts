'use server';

import prisma from '@/lib/prisma';
import { evaluateUserBadges, getUserBadgesWithProgress } from '@/lib/badges/evaluator';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from '@/types/utils';

export async function getUserBadges(): Promise<
  ActionResponse<{
    earnedBadges: any[];
    availableBadges: any[];
    totalEarned: number;
    totalAvailable: number;
  }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: 'ERROR', error: 'Unauthorized' };
    }

    const result = await getUserBadgesWithProgress(session.user.id);

    return {
      status: 'SUCCESS',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return {
      status: 'ERROR',
      error: 'Failed to fetch badges',
    };
  }
}

export async function checkForNewBadges(): Promise<
  ActionResponse<{
    awardedBadges: Array<{ id: string; name: string; points: number }>;
    totalPointsEarned: number;
    message: string;
  }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: 'ERROR', error: 'Unauthorized' };
    }

    const result = await evaluateUserBadges(session.user.id);

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/badges');

    const message =
      result.awardedBadges.length > 0
        ? `🏆 Congratulations! You earned ${result.awardedBadges.length} new badge${result.awardedBadges.length > 1 ? 's' : ''} and ${result.totalPointsEarned} bonus points!`
        : 'No new badges earned yet. Keep learning!';

    return {
      status: 'SUCCESS',
      data: {
        ...result,
        message,
      },
    };
  } catch (error) {
    console.error('Error checking for new badges:', error);
    return {
      status: 'ERROR',
      error: 'Failed to check for new badges',
    };
  }
}

export async function getRecentBadges(limit: number = 3): Promise<ActionResponse<any[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: 'ERROR', error: 'Unauthorized' };
    }

    const recentBadges = await prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
      take: limit,
    });

    return {
      status: 'SUCCESS',
      data: recentBadges.map((rb) => ({
        ...rb.badge,
        earnedAt: rb.earnedAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching recent badges:', error);
    return {
      status: 'ERROR',
      error: 'Failed to fetch recent badges',
    };
  }
}

export async function getBadgeStats(): Promise<
  ActionResponse<{
    totalEarned: number;
    totalAvailable: number;
    completionPercentage: number;
    totalBadgePoints: number;
  }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: 'ERROR', error: 'Unauthorized' };
    }

    const [earnedBadges, allBadges, userBadgesWithPoints] = await Promise.all([
      prisma.userBadge.count({
        where: { userId: session.user.id },
      }),
      prisma.badge.count(),
      prisma.userBadge.findMany({
        where: { userId: session.user.id },
        include: { badge: true },
      }),
    ]);

    const totalBadgePoints = userBadgesWithPoints.reduce((sum, ub) => sum + ub.badge.points, 0);

    const completionPercentage = Math.round((earnedBadges / allBadges) * 100);

    return {
      status: 'SUCCESS',
      data: {
        totalEarned: earnedBadges,
        totalAvailable: allBadges,
        completionPercentage,
        totalBadgePoints,
      },
    };
  } catch (error) {
    console.error('Error fetching badge stats:', error);
    return {
      status: 'ERROR',
      error: 'Failed to fetch badge stats',
    };
  }
}
