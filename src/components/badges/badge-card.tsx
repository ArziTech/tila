'use client';

import type { BadgeDefinition } from '@/lib/badges/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Trophy } from 'lucide-react';

interface BadgeCardProps {
  badge: BadgeDefinition & {
    earned?: boolean;
    earnedAt?: Date | null;
    progress?: {
      current: number;
      required: number;
      percentage: number;
    };
  };
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const { earned = false, progress } = badge;

  return (
    <Card
      className={`
      transition-all duration-300 hover:scale-105
      ${earned ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950' : 'border-gray-200 dark:border-gray-700 opacity-75'}
    `}
    >
      <CardHeader className="text-center">
        <div className="text-5xl mb-2">{badge.icon}</div>
        <CardTitle className="flex items-center justify-center gap-2">
          {badge.name}
          {earned ? (
            <Trophy className="w-5 h-5 text-yellow-500" />
          ) : (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </CardTitle>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant={earned ? 'default' : 'secondary'}>{badge.category}</Badge>
          <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            +{badge.points} pts
          </span>
        </div>

        {progress && !earned && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">
                {progress.current} / {progress.required}
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{progress.percentage}% complete</p>
          </div>
        )}

        {earned && badge.earnedAt && (
          <div className="text-xs text-center text-muted-foreground">
            Earned on{' '}
            {new Date(badge.earnedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
