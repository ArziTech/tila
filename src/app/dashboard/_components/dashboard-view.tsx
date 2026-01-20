"use client";
import { Award, BookOpen, Clock, Flame } from "lucide-react";
import Link from "next/link";
import LearningList from "@/components/learning/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Item, User } from "@/generated/prisma/client";
import type { DashboardStats } from "@/types";

interface Props {
  user: User;
  items: Item[];
  stats: DashboardStats;
}

const DashboardView = ({ user, items, stats }: Props) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between hover:shadow-md transition">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl">
                <Flame className="text-orange-500" size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {stats.currentStreak}
              </p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:shadow-md transition">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Clock className="text-blue-500" size={24} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {stats.todayHours.toFixed(1)}h
              </p>
              <p className="text-sm text-gray-500">Learned Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:shadow-md transition">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <BookOpen className="text-purple-500" size={24} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalHours.toFixed(0)}h
              </p>
              <p className="text-sm text-gray-500">Total Hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:shadow-md transition">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pink-50 rounded-2xl">
                <Award className="text-pink-500" size={24} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                Lvl {stats.level}
              </p>
              <p className="text-sm text-gray-500">Current Level</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <Button variant="gradient" onClick={() => {}} className="w-full">
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
