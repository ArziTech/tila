"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getUserStats } from "@/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DifficultyDistribution() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const user = data?.data?.user;

  const difficultyData = [
    { name: "Beginner", count: user?.beginnerCount ?? 0, color: "#22c55e" },
    {
      name: "Intermediate",
      count: user?.intermediateCount ?? 0,
      color: "#eab308",
    },
    { name: "Advanced", count: user?.advancedCount ?? 0, color: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={difficultyData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis type="number" />
            <Tooltip
              formatter={(value: number) => [`${value} items`, "Count"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {difficultyData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
