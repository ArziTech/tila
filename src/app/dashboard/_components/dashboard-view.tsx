"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LearningList from "@/components/learning/list";
import { ActivityChart } from "./activity-chart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import type { User } from "@/generated/prisma/client";
import { getDashboardData } from "@/actions/dashboard";

interface Props {
  user: User;
}

const DashboardView = ({ user }: Props) => {
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["dashboard", user.id],
    queryFn: () => getDashboardData(user.id),
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Loading...
            </h2>
          </div>
        </div>
        <StatsGrid stats={{
          currentStreak: 0,
          todayHours: 0,
          totalHours: 0,
          totalLogs: 0,
          level: 0,
        }} isLoading={true} />
        <div className="h-75 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-100 bg-gray-100 rounded-lg animate-pulse lg:col-span-2" />
          <div className="h-50 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (dashboardResponse?.status === "ERROR" || !dashboardResponse?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Error: {dashboardResponse?.error || "Unknown error"}
        </p>
      </div>
    );
  }

  const { items, stats, dailyActivity } = dashboardResponse.data;

  // Show empty state when no learning items
  if (items.length === 0) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user?.username}! 👋
            </h2>
            <p className="text-gray-500">
              Ready to start your learning journey?
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <StatsGrid stats={stats} />

        <EmptyState
          title="No learning items yet"
          description="Start by adding your first learning goal to track your progress"
          actionHref="/dashboard/items"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-gray-500">
            You've been consistent! Keep up the good work.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Activity Chart */}
      <ActivityChart dailyActivity={dailyActivity} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LearningList recentOnly limit={5} />
        </div>
        <div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Quick Add
            </h3>
            <Button variant="gradient" onClick={() => { }} className="w-full">
              + Add Learning
            </Button>
            <Button variant={"outline"} className="w-full mt-2" asChild>
              <Link href="/dashboard/items">View All ({items.length})</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
