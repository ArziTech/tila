import { auth } from "@/auth";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import DashboardView from "./_components/dashboard-view";
import { getDashboardData } from "@/actions/dashboard";
import QueryProvider from "@/components/query-provider";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  // Get user from session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Unauthorized: Please log in to view your dashboard
        </p>
      </div>
    );
  }

  // Fetch user data from database
  const prisma = await import("@/lib/prisma").then((m) => m.default);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          User not found
        </p>
      </div>
    );
  }

  // Create a new QueryClient instance for this request
  const queryClient = new QueryClient();

  // Prefetch dashboard data
  await queryClient.prefetchQuery({
    queryKey: ["dashboard", user.id],
    queryFn: () => getDashboardData(user.id),
  });

  // Dehydrate the query client to pass the prefetched data to the client
  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider>
      <HydrationBoundary state={dehydratedState}>
        <DashboardView user={user} />
      </HydrationBoundary>
    </QueryProvider>
  );
}
