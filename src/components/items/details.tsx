"use client";
import { useState, useEffect } from "react";
import { Note, Category } from "@/components/items/list";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Folder,
  Hash,
  Layout,
  Save,
  Tag,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Tiptap from "./editor";

interface NoteDetailProps {
  note: Note;
  categories: Category[];
}

const NoteDetails = ({ note, categories }: NoteDetailProps) => {
  const router = useRouter();

  // Guard clause to prevent "note is undefined" error
  if (!note) return null;

  const [formData, setFormData] = useState<Note>(note);
  const [tagInput, setTagInput] = useState(note.tags?.join(", ") || "");

  // Sync state when prop changes
  useEffect(() => {
    setFormData(note);
    setTagInput(note.tags?.join(", ") || "");
  }, [note]);

  const handleSave = () => {
    const updatedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const currentCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Detail Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/items")}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"
            title="Back to Notes"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div className="text-sm text-gray-500 hidden sm:flex items-center gap-2">
            <span className="opacity-60">Notes</span>
            <span>/</span>
            <span className="font-medium text-gray-800 truncate max-w-50">
              {formData.title || "Untitled"}
            </span>
          </div>
        </div>
      </header>

      {/* Detail Body */}
      <main className="flex-1 mx-auto w-full p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Area (Left) */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent leading-tight"
              placeholder="Note Title"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-3 lg:hidden text-sm text-gray-500 border-b border-gray-100 pb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />{" "}
              {new Date(formData.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formData.durationMinutes}m
            </span>
          </div>

          <div className="prose prose-lg prose-slate max-w-none w-full">
            <Tiptap />
            {/* <textarea */}
            {/*   value={formData.description} */}
            {/*   onChange={e => setFormData({ ...formData, description: e.target.value })} */}
            {/*   className="w-full h-[60vh] resize-none border-none outline-none text-gray-700 leading-relaxed text-lg bg-transparent placeholder-gray-300" */}
            {/*   placeholder="Start typing your thoughts..." */}
            {/* /> */}
          </div>
        </div>

        {/* Sidebar Properties (Right) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-28 space-y-6">
            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layout size={14} /> Properties
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Folder size={16} /> Category
                  </span>
                  <div className="col-span-2">
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock size={16} /> Duration
                  </span>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.durationMinutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            durationMinutes: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                      />
                      <span className="text-sm text-gray-400">min</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={16} /> Created
                  </span>
                  <div className="col-span-2">
                    <input
                      type="date"
                      value={formData.date.split("T")[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Hash size={14} /> Tags
              </h3>

              <div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="react, design, study"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none mb-2"
                />
                <p className="text-xs text-gray-400">Comma separated</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetails;
