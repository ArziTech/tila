import { notFound } from "next/navigation";
import { getCategories } from "@/actions/categories";
import { getItem } from "@/actions/items";
import NoteDetails from "@/components/items/details";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const noteResponse = await getItem(id);
  const categoriesResponse = await getCategories();

  if (noteResponse.status === "ERROR" || !noteResponse.data) {
    notFound();
  }

  const noteData = noteResponse.data;
  const categoriesData = categoriesResponse.data || [];

  return <NoteDetails note={noteData} categories={categoriesData} />;
};

export default Page;
