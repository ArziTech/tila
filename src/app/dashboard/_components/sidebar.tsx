"use client";
import { LogOut, Menu, X, Home, BookOpen, CheckSquare, Trophy, FolderOpen, BarChart3, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/actions/auth/index";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";

//
// --- Views Configuration ---
const Views = [
  { id: "/dashboard", label: "Dashboard", icon: Home },
  { id: "/dashboard/items", label: "My Learnings", icon: BookOpen },
  { id: "/dashboard/todos", label: "Todos", icon: CheckSquare },
  { id: "/dashboard/categories", label: "Categories", icon: FolderOpen },
  { id: "/dashboard/badges", label: "Badges", icon: Trophy },
  { id: "/dashboard/stats", label: "Statistics", icon: BarChart3 },
  { id: "/dashboard/profile", label: "Profile", icon: User },
];

// --- Sidebar Component ---
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const currentView = usePathname();

  return (
    <aside
      className={`bg-card border-r border-border transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-20"} h-screen sticky top-0 shadow-sm`}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              T
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">TILA</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-xl hover:bg-muted"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {Views.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200`,
              currentView === item.id && "shadow-md",
            )}
            asChild
          >
            <Link href={`${item.id}`}>
              <item.icon size={20} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <ThemeToggle />
          {isOpen && <span className="text-sm text-muted-foreground">Theme</span>}
        </div>
        <div className="border-t border-border pt-2">
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
