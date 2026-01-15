'use client'
import { Plus, Settings } from "lucide-react";
import Sidebar from "./_components/sidebar";
import DashboardView from "./_components/dashboard-view";
import LogsView from "./_components/logs-view";
import { useState } from "react";
import TodosView from "./_components/todos-view";
import EmptyState from "./_components/empty-state";

interface DashboardStats {
  currentStreak: number;
  todayHours: number;
  totalHours: number;
  totalLogs: number;
  level: number;
}

type ViewState = 'dashboard' | 'logs' | 'todos' | 'stats' | 'categories' | 'profile';

interface Todo {
  id: string;
  userId: string;
  categoryId?: string;
  topicId?: string;
  title: string;
  description?: string;
  estimatedDuration?: number;
  priority: 1 | 2 | 3;
  dueDate?: string;
  completedAt?: string;
  sortOrder: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const logs: any = []
  const categories: any = []
  const [stats, _setStats] = useState<DashboardStats>({ currentStreak: 0, todayHours: 0, totalHours: 0, totalLogs: 0, level: 1 });
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar
        isOpen={true}
        setIsOpen={() => { }}
        currentView={'dashboard'}
        setView={setCurrentView}
        onLogout={() => { }}
      />

      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-10 relative">
        {currentView === 'dashboard' && (
          <DashboardView
            user={{ displayName: 'wawan' }}
            stats={stats}
            logs={logs as any}
            categories={categories as any}
            onDeleteLog={() => { }}
          />
        )}

        {currentView === 'logs' && (
          <LogsView
            logs={logs}
            categories={[]}
            onDeleteLog={() => { }}
            onAddLog={() => { }}
          />
        )}

        {currentView === 'todos' && (
          <TodosView
            todos={todos}
            categories={categories}
            onComplete={() => { }}
            onDelete={(id: string) => {
              const newTodos = todos.filter(t => t.id !== id);
              setTodos(newTodos);
            }}
            onAdd={() => { }}
          />
        )}

        {/* Placeholder for other views */}
        {(currentView === 'categories' || currentView === 'stats' || currentView === 'profile') && (
          <EmptyState icon={Settings} message="This module is under construction." />
        )}

        {/* Global Floating Action Button for Timer/Add */}
        <button
          className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-40 group"
        >
          <Plus size={24} />
          <span className="absolute right-full mr-4 bg-white text-black px-2 py-1 rounded text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap top-1/2 -translate-y-1/2">Quick Log</span>
        </button>
      </main>

    </div>);
}
