"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Item } from "@/generated/prisma/client";
import { getCategories } from "@/actions/categories";
import { addItem, deleteItem, getItems } from "@/actions/items";
import { Button } from "../ui/button";
import NoteCard from "./card";
import CreateNoteModal from "./create-note-modal";

export type NoteWithCategory = Item & { category: Category | null };

const ItemList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const queryClient = useQueryClient();

  const { data: itemsResponse, isLoading: areNotesLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
  const notes = itemsResponse?.data || [];

  const { data: categoriesResponse, isLoading: areCategoriesLoading } =
    useQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    });
  const categories = categoriesResponse?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Note deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete note.");
    },
  });

  const addItemMutation = useMutation({
    mutationFn: addItem,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["items"] });
        toast.success("Note added successfully!");
        setIsModalOpen(false);
      } else {
        toast.error(response.error || "Failed to add note.");
      }
    },
    onError: () => {
      toast.error("Failed to add note.");
    },
  });

  const filteredNotes = notes.filter((note: NoteWithCategory) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || note.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (areNotesLoading || areCategoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              My Notes
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Capture your learning journey, one insight at a time.
            </p>
          </div>

          <Button
            variant="gradient"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 group rounded-2xl"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            Create Note
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-card p-2 rounded shadow-lg border border-border flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title, tag, or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-transparent rounded-md focus:bg-muted/50 outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-1 p-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              All Notes
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat.id
                  ? "bg-card text-foreground shadow-md ring-1 ring-border"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(note.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground/50">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No notes found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Try adjusting filters or create a new note.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSubmit={(values) => addItemMutation.mutate(values)}
        isPending={addItemMutation.isPending}
      />
    </div>
  );
};

export default ItemList;
