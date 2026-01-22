"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyActivity } from "@/actions/dashboard";

type ChartMetric = "points" | "itemsCount";

interface ActivityChartProps {
  dailyActivity: DailyActivity[];
}

export function ActivityChart({ dailyActivity }: ActivityChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("points");

  const formatXAxisLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getChartData = () => {
    return dailyActivity.map((activity) => ({
      date: formatXAxisLabel(activity.date),
      [metric === "points" ? "points" : "items"]: activity[metric],
      fullDate: activity.date,
    }));
  };

  const chartData = getChartData();

  const getMetricLabel = () => {
    return metric === "points" ? "Points Earned" : "Learning Items";
  };

  const getMetricColor = () => {
    return metric === "points" ? "#6366f1" : "#8b5cf6";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Daily Activity
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("points")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              metric === "points"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setMetric("itemsCount")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              metric === "itemsCount"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Learning Items
          </button>
        </div>
      </div>

      <div className="bg-card rounded border border-border p-4 sm:p-6 shadow-lg">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted opacity-30"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number) => [value, getMetricLabel()]}
                labelFormatter={(label: string) => {
                  const dataPoint = chartData.find((d) => d.date === label);
                  return dataPoint?.fullDate || label;
                }}
              />
              <Line
                type="monotone"
                dataKey={metric === "points" ? "points" : "items"}
                stroke={getMetricColor()}
                strokeWidth={3}
                dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No activity data available yet. Start learning to see your progress!
          </div>
        )}
      </div>
    </div>
  );
}
