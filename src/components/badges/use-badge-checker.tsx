'use client';

import { useEffect, useState } from 'react';
import { checkForNewBadges } from '@/actions/badges';

interface AwardedBadge {
  id: string;
  name: string;
  points: number;
}

export function useBadgeChecker() {
  const [awardedBadges, setAwardedBadges] = useState<AwardedBadge[]>([]);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked) return;

    const checkBadges = async () => {
      const result = await checkForNewBadges();
      if (result.status === 'SUCCESS' && result.data) {
        setAwardedBadges(result.data.awardedBadges);
        setTotalPointsEarned(result.data.totalPointsEarned);
      }
      setHasChecked(true);
    };

    checkBadges();
  }, [hasChecked]);

  return { awardedBadges, totalPointsEarned };
}
