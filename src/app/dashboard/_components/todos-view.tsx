"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Clock, ListTodo, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/generated/prisma/client";
import { formatDuration } from "@/lib/utils";
import EmptyState from "./empty-state";

const fetchTodos = async () => {
  const { data } = await axios.get("/api/todos");
  return data;
};

const addTodo = async (newTodo: { title: string }) => {
  const { data } = await axios.post("/api/todos", newTodo);
  return data;
};

const updateTodo = async (updatedTodo: { id: string; completed: boolean }) => {
  const { data } = await axios.put(`/api/todos/${updatedTodo.id}`, updatedTodo);
  return data;
};

const deleteTodo = async (id: string) => {
  await axios.delete(`/api/todos/${id}`);
};

const TodosView = () => {
  const queryClient = useQueryClient();
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodoTitle("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addMutation.mutate({ title: newTodoTitle.trim() });
    }
  };

  const priorityColors: Record<number, string> = {
    1: "bg-red-100 text-red-700 border-red-200",
    2: "bg-yellow-100 text-yellow-700 border-yellow-200",
    3: "bg-green-100 text-green-700 border-green-200",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Learning Backlog</h2>
        <div className="flex gap-2">
          <Input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new learning item..."
            className="w-64"
          />
          <Button variant={"gradient"} onClick={handleAddTodo}>
            <Plus size={20} /> Add Item
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {todos.length === 0 ? (
          <EmptyState icon={ListTodo} message="Nothing to learn? Impossible!" />
        ) : (
          todos.map((todo) => (
            <Card
              key={todo.id}
              className="hover:shadow-md transition border-l-4"
            >
              <div className="flex justify-between items-start p-4">
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        priorityColors[todo.priority]
                      }`}
                    >
                      {todo.priority === 1
                        ? "High Priority"
                        : todo.priority === 2
                          ? "Medium"
                          : "Low"}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{todo.title}</h3>
                  {todo.estimatedDuration && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> Est.{" "}
                      {formatDuration(todo.estimatedDuration)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="px-3! py-1! text-sm"
                    onClick={() =>
                      updateMutation.mutate({ id: todo.id, completed: true })
                    }
                  >
                    Done
                  </Button>
                  <Button
                    variant="ghost"
                    className="!px-3 !py-1 text-red-500"
                    onClick={() => deleteMutation.mutate(todo.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TodosView;
