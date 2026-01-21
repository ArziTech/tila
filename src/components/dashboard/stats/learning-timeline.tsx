"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getLearningTimeline } from "@/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function LearningTimeline() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["learning-timeline", days],
    queryFn: () => getLearningTimeline(days),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const timelineData = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Learning Journey</CardTitle>
        <Select
          value={days.toString()}
          onValueChange={(value) => setDays(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="365">All time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {timelineData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No learning activity yet. Start creating items!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value} items`, "Activity"]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
                name="Items Created"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
