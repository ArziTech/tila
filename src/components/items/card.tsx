import { Calendar, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Category, Note } from "./list";

interface Props {
  note: Note;
  category?: Category;
  onDelete: (e: React.MouseEvent) => void;
}

const NoteCard = ({ note, category, onDelete }: Props) => {
  return (
    <Link
      href={`/dashboard/items/${note.id}`}
      className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shadow-sm"
          title="Delete Note"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {category && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
            style={{ backgroundColor: `${category.color}40`, color: "#555" }}
          >
            {category.name}
          </span>
        )}
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Calendar size={12} />
          {new Date(note.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug group-hover:text-purple-600 transition-colors">
        {note.title}
      </h3>

      <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed grow">
        {note.description}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex gap-2 overflow-hidden">
          {note.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {(note.tags?.length || 0) > 3 && (
            <span className="text-[10px] text-gray-400">
              +{note.tags?.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          <Clock size={14} className="text-purple-400" />
          {note.durationMinutes}m
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
