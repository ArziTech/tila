import { BarChart2, CheckCircle, FileText, Home, ListTodo } from "lucide-react";

export const Views = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'items', icon: CheckCircle, label: 'Items' },
  { id: 'todos', icon: ListTodo, label: 'To-Do' },
  { id: 'categories', icon: FileText, label: 'Categories' },
  { id: 'stats', icon: BarChart2, label: 'Stats' },
] as const;


export type ViewState = typeof Views[number]['id']

export interface Todo {
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

export interface DashboardStats {
  currentStreak: number;
  todayHours: number;
  totalHours: number;
  totalLogs: number;
  level: number;
}

