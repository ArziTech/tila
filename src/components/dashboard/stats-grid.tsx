import { Award, BookOpen, Clock, Flame } from "lucide-react";
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
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${iconBgColor} rounded-2xl animate-pulse`}>
              <div className="w-6 h-6 bg-gray-300 rounded" />
            </div>
            {badge && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full animate-pulse ${badge.bgColor} ${badge.textColor}`}>
                {badge.text}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 w-24 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 ${iconBgColor} rounded-2xl`}>
            {icon}
          </div>
          {badge && (
            <span className={`text-xs font-bold ${badge.textColor} ${badge.bgColor} px-2 py-1 rounded-full`}>
              {badge.text}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Flame className="text-orange-500" size={24} />}
        iconBgColor="bg-orange-50"
        iconColor="text-orange-500"
        value={stats.currentStreak}
        label="Day Streak"
        badge={{
          text: "Active",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        }}
        isLoading={isLoading}
      />
      <StatCard
        icon={<Clock className="text-blue-500" size={24} />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-500"
        value={`${stats.todayHours.toFixed(1)}h`}
        label="Learned Today"
        isLoading={isLoading}
      />
      <StatCard
        icon={<BookOpen className="text-purple-500" size={24} />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-500"
        value={`${stats.totalHours.toFixed(0)}h`}
        label="Total Hours"
        isLoading={isLoading}
      />
      <StatCard
        icon={<Award className="text-pink-500" size={24} />}
        iconBgColor="bg-pink-50"
        iconColor="text-pink-500"
        value={`Lvl ${stats.level}`}
        label="Current Level"
        isLoading={isLoading}
      />
    </div>
  );
}
