"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { DUMMY_CATEGORIES, DUMMY_LEARNING_ITEMS, DUMMY_PROFILE } from "@/lib/dummy-data"

export interface LearningItem {
  id: string
  title: string
  description: string
  category: Category;
  topic: string
  dateAdded: string
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface UserProfile {
  name: string
  avatar: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  learningsSinceReset: number
}

interface LearningContextType {
  items: LearningItem[]
  categories: Category[]
  profile: UserProfile
  addItem: (item: Omit<LearningItem, "id" | "dateAdded">) => void
  deleteItem: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  getItemsByCategory: (category: string) => LearningItem[]
  getItemsByTopic: (topic: string) => LearningItem[]
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

const STORAGE_KEY = "tila-learning-data"
const CATEGORIES_KEY = "tila-categories"
const PROFILE_KEY = "tila-profile"

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LearningItem[]>([])
  const [categories, setCategories] = useState<Category[]>(DUMMY_CATEGORIES)
  const [profile, setProfile] = useState<UserProfile>(DUMMY_PROFILE)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY)
    const savedCategories = localStorage.getItem(CATEGORIES_KEY)
    const savedProfile = localStorage.getItem(PROFILE_KEY)

    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      setItems(DUMMY_LEARNING_ITEMS)
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      setCategories(DUMMY_CATEGORIES)
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      setProfile(DUMMY_PROFILE)
    }

    setIsLoaded(true)
  }, [])

  // Save items to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  // Save categories to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    }
  }, [categories, isLoaded])

  // Save profile to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    }
  }, [profile, isLoaded])

  const addItem = (item: Omit<LearningItem, "id" | "dateAdded">) => {
    const newItem: LearningItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setItems([newItem, ...items])

    // Update profile points and streak
    setProfile((prev) => ({
      ...prev,
      totalPoints:
        prev.totalPoints + (item.difficulty === "advanced" ? 30 : item.difficulty === "intermediate" ? 20 : 10),
      learningsSinceReset: prev.learningsSinceReset + 1,
    }))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories([...categories, newCategory])
  }

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }))
  }

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category.id === category)
  }

  const getItemsByTopic = (topic: string) => {
    return items.filter((item) => item.topic === topic)
  }

  return (
    <LearningContext.Provider
      value={{
        items,
        categories,
        profile,
        addItem,
        deleteItem,
        addCategory,
        updateProfile,
        getItemsByCategory,
        getItemsByTopic,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error("useLearning must be used within LearningProvider")
  }
  return context
}
