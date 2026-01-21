import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

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
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {actionHref && (
          <Button variant="gradient" asChild>
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
