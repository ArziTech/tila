import { Calendar, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/generated/prisma/client";
import type { NoteWithCategory } from "./list";

// Helper function to strip HTML tags and get plain text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

interface Props {
  note: NoteWithCategory;
  onDelete?: (e: React.MouseEvent) => void;
}

const NoteCard = ({ note, onDelete }: Props) => {
  const category = note.category;

  return (
    <Link
      href={`/dashboard/items/${note.id}`}
      className="group relative bg-card rounded p-5 border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {onDelete && (
        <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 bg-card border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition shadow-sm"
            title="Delete Note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        {category && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color,
              borderColor: `${category.color}40`
            }}
          >
            {category.name}
          </span>
        )}
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Calendar size={12} />
          {new Date(note.date_added).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {note.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed grow">
        {stripHtml(note.description)}
      </p>

      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <div className="flex gap-2 overflow-hidden">
          {note.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {(note.tags?.length || 0) > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{note.tags?.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
          <Clock size={14} className="text-purple-400 dark:text-purple-500" />
          {note.duration_minutes}m
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
