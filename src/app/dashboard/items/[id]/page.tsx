"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import NoteDetails from "@/components/items/details";
import type { Note } from "@/components/items/list";

const fetchNote = async (id: string) => {
  const { data } = await axios.get(`/api/items/${id}`);
  return data;
};

const fetchCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data;
};

const Page = () => {
  const params = useParams();
  const { id } = params;

  const { data: noteData, isLoading: isNoteLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id as string),
    enabled: !!id,
  });

  const { data: categoriesData, isLoading: areCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isNoteLoading || areCategoriesLoading) {
    return <div>Loading...</div>;
  }

  if (!noteData) return notFound();

  const formattedNote: Note = {
    id: noteData.id,
    title: noteData.title,
    description: noteData.description,
    categoryId: noteData.categoryId,
    date: noteData.date_added.toString(),
    durationMinutes: noteData.duration_minutes,
  };

  return <NoteDetails note={formattedNote} categories={categoriesData} />;
};

export default Page;
