import { Award, BookOpen, Clock, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label: string;
  badge?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  isLoading?: boolean;
}

export function StatCard({
  icon,
  iconBgColor,
  iconColor,
  value,
  label,
  badge,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col justify-between hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${iconBgColor} rounded-md animate-pulse`}>
              <div className="w-6 h-6 bg-muted-foreground/20 rounded" />
            </div>
            {badge && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full animate-pulse ${badge.bgColor} ${badge.textColor}`}>
                {badge.text}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-4 bg-muted/30 w-24 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 ${iconBgColor} rounded-md shadow-sm`}>
            {icon}
          </div>
          {badge && (
            <span className={`text-xs font-bold ${badge.textColor} ${badge.bgColor} px-3 py-1 rounded-full shadow-sm`}>
              {badge.text}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground font-medium mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        icon={<Flame className="text-orange-600" size={24} />}
        iconBgColor="bg-[rgb(255,212,179)] dark:bg-orange-500"
        iconColor="text-orange-600 dark:text-white"
        value={stats.currentStreak}
        label="Day Streak"
        badge={{
          text: "On Fire!",
          bgColor: "bg-[rgb(179,255,217)] dark:bg-green-500",
          textColor: "text-green-600 dark:text-white",
        }}
        isLoading={isLoading}
      />
      <StatCard
        icon={<TrendingUp className="text-blue-600" size={24} />}
        iconBgColor="bg-[rgb(179,229,255)] dark:bg-blue-500"
        iconColor="text-blue-600 dark:text-white"
        value={`${stats.todayHours.toFixed(1)}h`}
        label="Learned Today"
        isLoading={isLoading}
      />
      <StatCard
        icon={<BookOpen className="text-purple-600" size={24} />}
        iconBgColor="bg-[rgb(199,179,255)] dark:bg-purple-500"
        iconColor="text-purple-600 dark:text-white"
        value={`${stats.totalHours.toFixed(0)}h`}
        label="Total Hours"
        isLoading={isLoading}
      />
      <StatCard
        icon={<Award className="text-pink-600" size={24} />}
        iconBgColor="bg-[rgb(255,179,217)] dark:bg-pink-500"
        iconColor="text-pink-600 dark:text-white"
        value={`Lvl ${stats.level}`}
        label="Current Level"
        isLoading={isLoading}
      />
    </div>
  );
}
