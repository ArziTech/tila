import type {
  LearningItem,
  Category,
  UserProfile,
} from "@/context/learning-context";

export const DUMMY_CATEGORIES: Category[] = [
  { id: "1", name: "Technology", color: "#FFB3E6" },
  { id: "2", name: "Science", color: "#FFD4A3" },
  { id: "3", name: "Languages", color: "#A3F0FF" },
  { id: "4", name: "Arts", color: "#D4A3FF" },
  { id: "5", name: "Business", color: "#A3FFC4" },
];

export const DUMMY_LEARNING_ITEMS: LearningItem[] = [
  {
    id: "1",
    title: "React Server Components",
    description:
      "Learned about the benefits of server components in Next.js for better performance and security",
    category: "Technology",
    topic: "React",
    dateAdded: "2026-01-15",
    difficulty: "advanced",
    tags: ["react", "nextjs", "performance"],
  },
  {
    id: "2",
    title: "Photosynthesis Process",
    description:
      "Understanding how plants convert light energy into chemical energy through photosynthesis",
    category: "Science",
    topic: "Biology",
    dateAdded: "2026-01-14",
    difficulty: "intermediate",
    tags: ["biology", "plants", "energy"],
  },
  {
    id: "3",
    title: "Spanish Verb Conjugation",
    description:
      "Practiced conjugating regular and irregular verbs in past and present tenses",
    category: "Languages",
    topic: "Spanish",
    dateAdded: "2026-01-14",
    difficulty: "intermediate",
    tags: ["spanish", "grammar", "verbs"],
  },
  {
    id: "4",
    title: "Color Theory in Design",
    description:
      "Explored how colors interact, complementary colors, and their psychological impact on design",
    category: "Arts",
    topic: "Design",
    dateAdded: "2026-01-13",
    difficulty: "beginner",
    tags: ["design", "color", "psychology"],
  },
  {
    id: "5",
    title: "Market Segmentation",
    description:
      "Learned how to divide markets into distinct groups and target them effectively",
    category: "Business",
    topic: "Marketing",
    dateAdded: "2026-01-13",
    difficulty: "intermediate",
    tags: ["marketing", "business", "strategy"],
  },
  {
    id: "6",
    title: "TypeScript Generics",
    description:
      "Deep dive into generic types for writing reusable and type-safe code",
    category: "Technology",
    topic: "TypeScript",
    dateAdded: "2026-01-12",
    difficulty: "advanced",
    tags: ["typescript", "generics", "types"],
  },
  {
    id: "7",
    title: "Quantum Computing Basics",
    description:
      "Introduction to qubits, quantum gates, and how quantum computers differ from classical computers",
    category: "Science",
    topic: "Physics",
    dateAdded: "2026-01-12",
    difficulty: "advanced",
    tags: ["quantum", "physics", "computing"],
  },
  {
    id: "8",
    title: "French Pronunciation",
    description:
      "Practiced French nasal vowels and silent letter rules in common words",
    category: "Languages",
    topic: "French",
    dateAdded: "2026-01-11",
    difficulty: "beginner",
    tags: ["french", "pronunciation", "phonetics"],
  },
];

export const DUMMY_PROFILE: UserProfile = {
  name: "Alex Chen",
  avatar: "🎓",
  totalPoints: 180,
  currentStreak: 8,
  longestStreak: 15,
  learningsSinceReset: 8,
};
