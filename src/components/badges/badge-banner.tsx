'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecentBadges } from '@/actions/badges';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BadgeBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [recentBadgeIds, setRecentBadgeIds] = useState<Set<string>>(new Set());

  const { data: recentBadges } = useQuery({
    queryKey: ['recent-badges'],
    queryFn: () => getRecentBadges(5),
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!recentBadges?.data) return;

    const newBadges = recentBadges.data.filter((badge) => !recentBadgeIds.has(badge.id));

    if (newBadges.length > 0) {
      setDismissed(false);

      setRecentBadgeIds((prev) => {
        const updated = new Set(prev);
        newBadges.forEach((badge) => updated.add(badge.id));
        return updated;
      });
    }
  }, [recentBadges, recentBadgeIds]);

  if (dismissed || !recentBadges?.data || recentBadges.data.length === 0) {
    return null;
  }

  const latestBadge = recentBadges.data[0];

  return (
    <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{latestBadge.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="font-semibold">New Badge Earned!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {latestBadge.name} - {latestBadge.description}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              +{latestBadge.points} bonus points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/badges')}>
            View Badges
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
