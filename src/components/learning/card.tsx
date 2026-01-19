"use client";

import { type LearningItem, useLearning } from "@/context/learning-context";

interface LearningCardProps {
  item: LearningItem;
}

export default function LearningCard({ item }: LearningCardProps) {
  const { deleteItem, categories } = useLearning();
  const category = categories.find((c) => c.id === item.category.id);

  const difficultyColors = {
    beginner: "bg-success/20 text-success",
    intermediate: "bg-secondary/20 text-secondary",
    advanced: "bg-destructive/20 text-destructive",
  };

  const getDaysSince = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const days = Math.floor(
      (new Date(today).getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
          {item.title}
        </h3>
        <button
          onClick={() => deleteItem(item.id)}
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition text-lg ml-2"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-card-foreground"
          style={{ backgroundColor: category?.color || "#FFB3E6" }}
        >
          {category?.name}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[item.difficulty]}`}
        >
          {item.difficulty}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {getDaysSince(item.dateAdded)}
      </p>
    </div>
  );
}
