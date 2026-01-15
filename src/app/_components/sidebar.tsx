import { BarChart2, CheckCircle, FileText, Home, ListTodo, LogOut, Menu, X } from "lucide-react";

type ViewState = 'dashboard' | 'logs' | 'todos' | 'stats' | 'categories' | 'profile';
//
// --- Sidebar Component ---
const Sidebar = ({
  isOpen,
  setIsOpen,
  setView,
  currentView,
  onLogout
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentView: ViewState;
  setView: (v: ViewState) => void;
  onLogout: () => void
}) => {

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'logs', icon: CheckCircle, label: 'Logs' },
    { id: 'todos', icon: ListTodo, label: 'To-Do' },
    { id: 'categories', icon: FileText, label: 'Categories' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-20'} h-screen sticky top-0`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-xl tracking-tight">TILA</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold mx-auto">T</div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setView(item.id as ViewState) }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === item.id
              ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition">
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
