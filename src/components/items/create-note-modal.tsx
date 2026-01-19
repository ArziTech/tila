"use client";
import { ChevronDown, Tag, X } from "lucide-react";
import { useState } from "react";

const CreateNoteModal = ({ isOpen, onClose, onSubmit, categories }: any) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    durationMinutes: 60,
    tags: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">New Note</h2>
            <p className="text-sm text-gray-500">What did you learn today?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Title
            </label>
            <input
              autoFocus
              className="w-full text-xl font-semibold text-gray-800 placeholder-gray-300 border-b-2 border-gray-100 focus:border-purple-500 outline-none py-2 transition-colors"
              placeholder="e.g. Advanced TypeScript Patterns"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMinutes: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Description
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none min-h-30 resize-none"
              placeholder="Write your key takeaways here..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Tags (comma separated)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition">
              <Tag size={16} className="text-gray-400" />
              <input
                className="bg-transparent w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                placeholder="react, frontend, hooks"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                ...form,
                id: Date.now().toString(),
                date: new Date().toISOString(),
                tags: form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            className="px-8 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteModal;
