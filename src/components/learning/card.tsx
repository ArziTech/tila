"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Category, Item } from "@/generated/prisma";

interface LearningCardProps {
  item: Item & { category: Category };
}

const deleteItem = async (id: string) => {
  await axios.delete(`/api/items/${id}`);
};

export default function LearningCard({ item }: LearningCardProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const difficultyColors: { [key: string]: string } = {
    beginner: "bg-success/20 text-success",
    intermediate: "bg-secondary/20 text-secondary",
    advanced: "bg-destructive/20 text-destructive",
  };

  const getDaysSince = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.floor(
      (today.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
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
          type="button"
          onClick={() => mutation.mutate(item.id)}
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
          style={{ backgroundColor: item.category?.color || "#FFB3E6" }}
        >
          {item.category?.name}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            difficultyColors[item.difficulty]
          }`}
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
        {getDaysSince(item.date_added)}
      </p>
    </div>
  );
}
