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
        <h3 className="text-lg font-semibold text-gray-800">
          Daily Activity
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("points")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              metric === "points"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setMetric("itemsCount")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              metric === "itemsCount"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Learning Items
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
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
                strokeWidth={2}
                dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No activity data available yet. Start learning to see your progress!
          </div>
        )}
      </div>
    </div>
  );
}
