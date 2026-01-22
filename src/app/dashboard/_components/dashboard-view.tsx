"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LearningList from "@/components/learning/list";
import { ActivityChart } from "./activity-chart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { BadgeBanner } from "@/components/badges/badge-banner";
import { BadgeNotification } from "@/components/badges/badge-notification";
import { useBadgeChecker } from "@/components/badges/use-badge-checker";
import type { User } from "@/generated/prisma/client";
import { getDashboardData } from "@/actions/dashboard";
import { Sparkles, TrendingUp } from "lucide-react";

interface Props {
  user: User;
}

const DashboardView = ({ user }: Props) => {
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["dashboard", user.id],
    queryFn: () => getDashboardData(user.id),
  });

  // Check for new badges on mount
  const { awardedBadges, totalPointsEarned } = useBadgeChecker();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                Loading...
              </h2>
            </div>
          </div>
        </div>
        <StatsGrid stats={{
          currentStreak: 0,
          todayHours: 0,
          totalHours: 0,
          totalLogs: 0,
          level: 0,
        }} isLoading={true} />
        <div className="h-75 bg-muted/30 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-100 bg-muted/30 rounded-md animate-pulse lg:col-span-2" />
          <div className="h-50 bg-muted/30 rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (dashboardResponse?.status === "ERROR" || !dashboardResponse?.data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-destructive text-lg font-medium">
            Error: {dashboardResponse?.error || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const { items, stats, dailyActivity } = dashboardResponse.data;

  // Show empty state when no learning items
  if (items.length === 0) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <BadgeBanner />
        <BadgeNotification awardedBadges={[]} totalPointsEarned={0} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                Welcome, {user?.username}! 👋
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Ready to start your learning journey?
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-muted-foreground">
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
      <BadgeBanner />
      <BadgeNotification awardedBadges={awardedBadges} totalPointsEarned={totalPointsEarned} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Welcome back, {user?.username}! 👋
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            You've been consistent! Keep up the good work.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-muted-foreground">
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
          <div className="bg-card rounded p-6 border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-extrabold mb-6 text-foreground">
              Quick Actions
            </h3>
            <Button
              className="w-full rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => { }}
              asChild
            >
              <Link href="/dashboard/items/new">
                + Add Learning
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full mt-3 rounded-2xl font-medium transition-all duration-200"
              asChild
            >
              <Link href="/dashboard/items">View All ({items.length})</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
