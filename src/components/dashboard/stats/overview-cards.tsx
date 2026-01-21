"use client";

import { Award, Flame, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewCardsProps {
  stats: {
    learnings: number;
    current_streak: number;
    total_points: number;
    badgesEarned: number;
  };
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Items",
      value: stats.learnings,
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Current Streak",
      value: `${stats.current_streak} days`,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      title: "Total Points",
      value: stats.total_points,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: "Badges Earned",
      value: stats.badgesEarned,
      icon: Award,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function OverviewCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
