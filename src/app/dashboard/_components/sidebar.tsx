"use client";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/actions/auth/index";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Views } from "@/types";

//
// --- Sidebar Component ---
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const currentView = usePathname();

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-20"} h-screen sticky top-0`}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-xl tracking-tight">TILA</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {Views.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "gradient" : "ghost"}
            className={cn(
              `w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200`,
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

      <div className="p-4 border-t border-gray-100">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
