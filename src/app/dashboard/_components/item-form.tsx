"use client";

import type React from "react";

import { useState } from "react";
import { useLearning } from "@/context/learning-context";
import { Button } from "@/components/ui/button";

interface ItemFormProps {
  onComplete: () => void;
}

const ItemForm = ({ onComplete }: ItemFormProps) => {
  const { categories, addItem } = useLearning();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0]?.id || "",
    topic: "",
    difficulty: "intermediate" as const,
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.topic.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    addItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      topic: formData.topic,
      difficulty: formData.difficulty,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setFormData({
      title: "",
      description: "",
      category: categories[0]?.id || "",
      topic: "",
      difficulty: "intermediate",
      tags: "",
    });

    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Add New Learning
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="What did you learn?"
              className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add more details about what you learned..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic *</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="e.g., React Hooks"
                className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="beginner">Beginner (10 pts)</option>
                <option value="intermediate">Intermediate (20 pts)</option>
                <option value="advanced">Advanced (30 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="react, hooks, javascript"
                className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant={"outline"}
              type="button"
              className="flex-1"
              onClick={onComplete}
            >
              Cancel
            </Button>
            <Button variant={"gradient"} type="submit" className="flex-1">
              Add Learning
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
