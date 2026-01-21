"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Target, TrendingUp } from "lucide-react";
import { getLearningInsights } from "@/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function LearningInsights() {
  const { data, isLoading } = useQuery({
    queryKey: ["learning-insights"],
    queryFn: getLearningInsights,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const insights = data?.data;

  if (!insights) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Most Productive Day</span>
          </div>
          <span className="font-semibold">{insights.mostProductiveDay}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm">Avg. Items/Week</span>
          </div>
          <span className="font-semibold">{insights.avgItemsPerWeek}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Consistency Score</span>
            </div>
            <span className="font-semibold">{insights.consistencyScore}%</span>
          </div>
          <Progress value={insights.consistencyScore} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
