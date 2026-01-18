"use client"

import { useState } from "react"
import { useLearning } from "@/context/learning-context"
import LearningCard from "./card"

interface LearningListProps {
  recentOnly?: boolean
  limit?: number
}

export default function LearningList({ recentOnly = false, limit }: LearningListProps) {
  const { items, categories } = useLearning()
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  let displayItems = items

  if (recentOnly) {
    displayItems = items.slice(0, limit || items.length)
  }

  if (filterCategory) {
    displayItems = displayItems.filter((item) => item.category.id === filterCategory)
  }

  if (searchQuery) {
    displayItems = displayItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  return (
    <div className="space-y-6">
      {!recentOnly && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-primary">All Learnings</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learnings..."
              className="flex-1 px-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-2xl mb-2">📚</p>
            <p className="text-muted-foreground">
              {items.length === 0
                ? "No learnings yet. Start by adding your first learning!"
                : "No learnings found matching your filters."}
            </p>
          </div>
        ) : (
          displayItems.map((item) => <LearningCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}
