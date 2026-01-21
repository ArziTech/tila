import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUserStats } from "@/actions/stats";
import { auth } from "@/auth";
import { BadgesShowcase } from "@/components/dashboard/stats/badges-showcase";
import { CategoryBreakdown } from "@/components/dashboard/stats/category-breakdown";
import { DifficultyDistribution } from "@/components/dashboard/stats/difficulty-distribution";
import { LearningInsights } from "@/components/dashboard/stats/learning-insights";
import { LearningTimeline } from "@/components/dashboard/stats/learning-timeline";
import {
  OverviewCards,
  OverviewCardsSkeleton,
} from "@/components/dashboard/stats/overview-cards";
import QueryProvider from "@/components/query-provider";

export default async function StatsPage() {
  // Get user from session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Unauthorized: Please log in to view your statistics
        </p>
      </div>
    );
  }

  // Create a new QueryClient instance for this request
  const queryClient = new QueryClient();

  // Prefetch user stats
  await queryClient.prefetchQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryProvider>
      <HydrationBoundary state={dehydratedState}>
        <StatsView />
      </HydrationBoundary>
    </QueryProvider>
  );
}

function StatsView() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Statistics</h1>
        <p className="text-muted-foreground">
          Track your progress and celebrate your achievements
        </p>
      </div>

      <OverviewCardsWrapper />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <LearningTimeline />
        </div>
        <CategoryBreakdown />
        <DifficultyDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningInsights />
        <BadgesShowcase />
      </div>
    </div>
  );
}

async function OverviewCardsWrapper() {
  const stats = await getUserStats();

  if (stats.status === "SUCCESS" && stats.data) {
    return (
      <OverviewCards
        stats={{
          learnings: stats.data.user.learnings,
          current_streak: stats.data.user.current_streak,
          total_points: stats.data.user.total_points,
          badgesEarned: stats.data.badgesEarned,
        }}
      />
    );
  }

  return <OverviewCardsSkeleton />;
}
