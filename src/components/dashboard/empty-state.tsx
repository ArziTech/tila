import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Plus, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel = "Add Learning",
  actionIcon = <Plus className="mr-2 h-4 w-4" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-500 dark:to-pink-500 rounded flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-purple-600 dark:text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-lg mb-8">{description}</p>
        {actionHref && (
          <Button
            className="rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            asChild
          >
            <Link href={actionHref as any}>
              {actionIcon}
              {actionLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
