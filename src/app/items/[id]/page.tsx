'use client'
import NoteDetails from "@/components/items/details"
import { Category, Note } from "@/components/items/list"

const Page = () => {
  const note: Note = {
    id: "",
    title: "",
    durationMinutes: 199,
    description: "",
    categoryId: "",
    date: new Date().getDate().toString()
  }
  const categories: Category[] = []

  return (
    <NoteDetails
      note={note}
      categories={categories}
      onSave={() => { }}
      onDelete={() => { }}
    />
  )
}

export default Page;
