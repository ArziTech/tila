import Sidebar from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-10 relative">
        {children}
      </main>
    </div>
  );
}
