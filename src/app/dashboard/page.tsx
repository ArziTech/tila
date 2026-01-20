import { getDashboardData } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

export default async function App() {
  const response = await getDashboardData();

  if (response.status === "ERROR" || !response.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Error: {response.error || "Unknown error"}
        </p>
      </div>
    );
  }

  const { user, items, stats } = response.data;

  // Handle case where there are no learning items
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-gray-600 text-xl mb-4">No learning items found.</p>
        <p className="text-gray-500">
          Start by adding your first learning goal!
        </p>
        {/* Potentially add a button to create a new item */}
      </div>
    );
  }

  return <DashboardView user={user} items={items} stats={stats} />;
}
