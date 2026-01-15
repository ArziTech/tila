import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import { Award, BookOpen, Clock, Flame, X } from "lucide-react";
import EmptyState from "./empty-state";

const DashboardView = ({ user, stats, logs, categories, onDeleteLog }: any) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.displayName}! 👋</h2>
        <p className="text-gray-500">You've been consistent! Keep up the good work.</p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-sm font-medium text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="flex flex-col justify-between hover:shadow-md transition">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-2xl"><Flame className="text-orange-500" size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.currentStreak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between hover:shadow-md transition">

        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl"><Clock className="text-blue-500" size={24} /></div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.todayHours.toFixed(1)}h</p>
            <p className="text-sm text-gray-500">Learned Today</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between hover:shadow-md transition">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl"><BookOpen className="text-purple-500" size={24} /></div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalHours.toFixed(0)}h</p>
            <p className="text-sm text-gray-500">Total Hours</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between hover:shadow-md transition">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-50 rounded-2xl"><Award className="text-pink-500" size={24} /></div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-3xl font-bold text-gray-800">Lvl {stats.level}</p>
            <p className="text-sm text-gray-500">Current Level</p>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-gray-400" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {logs.length === 0 ? <EmptyState icon={BookOpen} message="No logs yet." /> : logs.slice(0, 5).reverse().map((log: any) => {
            const cat = categories.find((c: any) => c.id === log.categoryId);
            return (
              <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:shadow-sm transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: (cat?.color || '#eee') + '30', color: cat?.color }}>
                    {cat?.icon === 'code' ? '💻' : cat?.icon === 'palette' ? '🎨' : '📚'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{log.title}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }}></span>
                      {cat?.name} • {formatDuration(log.durationMinutes)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-medium">{formatDate(log.logDate)}</span>
                  <button onClick={() => onDeleteLog(log.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"><X size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Distribution</h3>
        <Card className="h-64 flex items-center justify-center text-gray-400">
          {/* Placeholder for chart */}
          <div className="flex gap-2 items-end h-32">
            {categories.map((cat: any, i: number) => (
              <div key={i} className="w-8 bg-gray-100 rounded-t-lg relative group" style={{ height: `${Math.random() * 100}%`, backgroundColor: cat.color }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">{cat.name}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default DashboardView;
