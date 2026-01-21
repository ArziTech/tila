'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AwardedBadge {
  id: string;
  name: string;
  points: number;
}

interface BadgeNotificationProps {
  awardedBadges: AwardedBadge[];
  totalPointsEarned: number;
}

export function BadgeNotification({ awardedBadges, totalPointsEarned }: BadgeNotificationProps) {
  const router = useRouter();

  useEffect(() => {
    if (awardedBadges.length === 0) return;

    if (awardedBadges.length === 1) {
      const badge = awardedBadges[0];
      toast.success(
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="font-semibold">Badge Earned!</p>
            <p className="text-sm text-muted-foreground">
              {badge.name} (+{badge.points} pts)
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => router.push('/dashboard/badges'),
          },
        }
      );
    } else {
      toast.success(
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="font-semibold">🏆 {awardedBadges.length} Badges Earned!</p>
            <p className="text-sm text-muted-foreground">+{totalPointsEarned} bonus points</p>
          </div>
        </div>,
        {
          duration: 6000,
          action: {
            label: 'View All',
            onClick: () => router.push('/dashboard/badges'),
          },
        }
      );
    }
  }, [awardedBadges, totalPointsEarned, router]);

  return null;
}
