'use client'
import { BookOpen, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import NoteCard from './card';
import CreateNoteModal from './create-note-modal';
import { Button } from '../ui/button';


export interface Note {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  durationMinutes: number;
  date: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// TEMPORARY
const INITIAL_NOTES: Note[] = [
  { id: '1', title: 'React Hooks Deep Dive', description: 'Learned about useMemo and useCallback. Important to prevent unnecessary re-renders in child components.', categoryId: '1', durationMinutes: 45, date: '2023-10-24', tags: ['React', 'Frontend'] },
  { id: '2', title: 'Color Theory Basics', description: 'Understanding complementary and split-complementary colors. The 60-30-10 rule is super helpful for UI design.', categoryId: '2', durationMinutes: 30, date: '2023-10-23', tags: ['UI', 'Art'] },
  { id: '3', title: 'Market Analysis', description: 'Studied SWOT analysis techniques for small startups.', categoryId: '3', durationMinutes: 60, date: '2023-10-22' },
  { id: '4', title: 'Japanese Kanji Practice', description: 'Practiced 20 new characters related to nature.', categoryId: '4', durationMinutes: 20, date: '2023-10-21', tags: ['N5'] },
  { id: '5', title: 'Tailwind CSS Grid', description: 'Grid layout is much easier than Flexbox for 2D layouts. col-span-2 is a lifesaver.', categoryId: '1', durationMinutes: 90, date: '2023-10-20' },
];

const CATEGORIES: Category[] = [
  { id: '1', name: 'Programming', color: '#C7B3FF', icon: 'code' },
  { id: '2', name: 'Design', color: '#B3FFD9', icon: 'palette' },
  { id: '3', name: 'Business', color: '#B3E5FF', icon: 'briefcase' },
  { id: '4', name: 'Languages', color: '#FFD4B3', icon: 'globe' },
];

const ItemList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // TODO: Change this
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-800 p-6 md:p-10 animate-in fade-in duration-300">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Notes</h1>
            <p className="text-gray-500">Capture your learning journey, one insight at a time.</p>
          </div>

          <Button
            variant='gradient'
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2  group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Create Note
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, tag, or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-transparent rounded-2xl focus:bg-gray-50 outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-1 p-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              All Notes
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-white text-gray-800 shadow-md ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
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
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                category={CATEGORIES.find(c => c.id === note.categoryId)}
                onClick={() => { }}
                onDelete={() => { /*e.stopPropagation(); handleDeleteNote(note.id);*/ }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-500 max-w-sm">Try adjusting filters or create a new note.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-6 text-purple-600 font-semibold hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={CATEGORIES}
        onSubmit={() => { }}
      />

    </div>
  )
}

export default ItemList;
