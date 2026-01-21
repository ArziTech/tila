"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { getUserStats } from "@/actions/stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BadgesShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading badges...
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentBadges = data?.data?.recentBadges ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentBadges.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-2">No badges earned yet.</p>
            <p className="text-sm">
              Keep learning to unlock your first achievement!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="default">{badge.category}</Badge>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                    +{badge.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/dashboard/badges"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline text-center block"
          >
            View all badges and progress →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
