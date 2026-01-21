"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpDown,
  CalendarDays,
  Clock,
  GripVertical,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Category, Todo, TodoStatus } from "@/generated/prisma/client";
import {
  addTodo,
  completeTodo,
  deleteTodo,
  getTodos,
  reorderTodos,
  updateTodo,
} from "@/actions/todos";
import { getCategories } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateTodoModal from "@/components/todos/create-todo-modal";
import EmptyState from "./empty-state";

export type TodoWithCategory = Todo & { category: Category | null };

interface SortableTodoCardProps {
  todo: TodoWithCategory;
  priorityColors: Record<number, string>;
  statusColors: Record<TodoStatus, string>;
  handleStatusChange: (todo: TodoWithCategory, newStatus: TodoStatus) => void;
  completeMutation: any;
  deleteMutation: any;
  isDragEnabled: boolean;
}

function SortableTodoCard({
  todo,
  priorityColors,
  statusColors,
  handleStatusChange,
  completeMutation,
  deleteMutation,
  isDragEnabled,
}: SortableTodoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: todo.id,
      disabled: !isDragEnabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`hover:shadow-md transition border-l-4 ${todo.status === "COMPLETED" ? "opacity-60" : ""
          }`}
        style={{
          borderLeftColor:
            todo.category?.color ||
            (todo.priority === 1
              ? "#ef4444"
              : todo.priority === 2
                ? "#eab308"
                : "#22c55e"),
        }}
      >
        <div className="flex justify-between items-start p-4">
          <div className="space-y-2 flex-1">
            <div className="flex gap-2 items-center flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded border ${priorityColors[todo.priority]
                  }`}
              >
                {todo.priority === 1
                  ? "High"
                  : todo.priority === 2
                    ? "Medium"
                    : "Low"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded border ${statusColors[todo.status]
                  }`}
              >
                {todo.status.toLowerCase().replace("_", " ")}
              </span>
              {todo.category && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${todo.category.color}40`,
                    color: "#555",
                  }}
                >
                  {todo.category.name}
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg">{todo.title}</h3>
            {todo.content && (
              <p className="text-sm text-gray-600 line-clamp-2">{todo.content}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500">
              {todo.dueDate && (
                <div className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  Due {new Date(todo.dueDate).toLocaleDateString()}
                </div>
              )}
              {todo.estimatedDuration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} /> Est. {todo.estimatedDuration}m
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-start">
            {isDragEnabled && (
              <button
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
                {...attributes}
                {...listeners}
              >
                <GripVertical size={16} className="text-gray-400" />
              </button>
            )}
            {todo.status === "ONGOING" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => completeMutation.mutate(todo.id)}
                disabled={completeMutation.isPending}
              >
                Complete
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {todo.status === "ONGOING" && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(todo, "CONTINUE_LATER")
                      }
                    >
                      Continue Later
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(todo, "ARCHIVED")}
                    >
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(todo, "CANCELED")}
                    >
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
                {todo.status !== "ONGOING" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(todo, "ONGOING")}
                  >
                    Mark as Ongoing
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </div>
  );
}

const TodosView = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: todosResponse, isLoading: areTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  const todos = todosResponse?.data || [];

  const { data: categoriesResponse, isLoading: areCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesResponse?.data || [];

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        setIsModalOpen(false);
        toast.success("Todo added successfully!");
      } else {
        toast.error(response.error || "Failed to add todo.");
      }
    },
    onError: () => {
      toast.error("Failed to add todo.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        toast.success("Todo updated successfully!");
      } else {
        toast.error(response.error || "Failed to update todo.");
      }
    },
    onError: () => {
      toast.error("Failed to update todo.");
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeTodo,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
        const message = response?.data?.item
          ? "Todo completed! New learning item created."
          : "Todo completed!";
        toast.success(message);
      } else {
        toast.error(response.error || "Failed to complete todo.");
      }
    },
    onError: () => {
      toast.error("Failed to complete todo.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        toast.success("Todo deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete todo.");
      }
    },
    onError: () => {
      toast.error("Failed to delete todo.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTodos,
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      } else {
        toast.error(response.error || "Failed to reorder todos.");
      }
    },
    onError: () => {
      toast.error("Failed to reorder todos.");
    },
  });

  const handleStatusChange = (todo: TodoWithCategory, newStatus: TodoStatus) => {
    updateMutation.mutate({ id: todo.id, values: { status: newStatus } });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);

      const newOrder = [...todos];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      // Optimistically update the UI
      queryClient.setQueryData(["todos"], {
        ...todosResponse,
        data: newOrder,
      });

      // Call the server action with the new order
      reorderMutation.mutate(newOrder.map((t) => t.id));
    }
  };

  const priorityColors: Record<number, string> = {
    1: "bg-red-100 text-red-700 border-red-200",
    2: "bg-yellow-100 text-yellow-700 border-yellow-200",
    3: "bg-green-100 text-green-700 border-green-200",
  };

  const statusColors: Record<TodoStatus, string> = {
    ONGOING: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELED: "bg-red-100 text-red-700 border-red-200",
    CONTINUE_LATER: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  // Filter and sort todos
  let filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      statusFilter === "ALL" || todo.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || todo.categoryId === categoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Sort todos
  if (sortBy === "order") {
    // Keep the existing order from the database (drag order)
    filteredTodos = [...filteredTodos];
  } else if (sortBy === "dueDate") {
    filteredTodos = [...filteredTodos].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
  } else if (sortBy === "priority") {
    filteredTodos = [...filteredTodos].sort((a, b) => {
      const diff = a.priority - b.priority;
      return sortOrder === "asc" ? diff : -diff;
    });
  } else if (sortBy === "createdAt") {
    filteredTodos = [...filteredTodos].sort((a, b) => {
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
  }

  // Only enable drag-and-drop for "ALL" filter, no category filter, no search, and "order" sort
  const isDragEnabled =
    statusFilter === "ALL" &&
    categoryFilter === "ALL" &&
    searchQuery === "" &&
    sortBy === "order";

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    searchQuery !== "" ||
    sortBy !== "order" ||
    sortOrder !== "asc";

  const handleClearFilters = () => {
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSearchQuery("");
    setSortBy("order");
    setSortOrder("asc");
  };

  if (areTodosLoading || areCategoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Learning Backlog</h2>
        <div className="flex gap-2">
          <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Add Todo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort by select with icons */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                <option value="order">Custom Order</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Created Date</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                {sortBy === "order" && <GripVertical size={16} />}
                {sortBy === "dueDate" && <CalendarDays size={16} />}
                {sortBy === "priority" && <Target size={16} />}
                {sortBy === "createdAt" && <Clock size={16} />}
              </div>
            </div>

            {/* Ascending/Descending toggle */}
            {sortBy !== "order" && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
                className="relative"
              >
                <ArrowUpDown size={16} />
                <span className="absolute -top-1 -right-1 text-xs font-bold">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </span>
              </Button>
            )}

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear filters"
              >
                <X size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "ONGOING", "COMPLETED", "ARCHIVED", "CANCELED", "CONTINUE_LATER"].map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status.replace("_", " ").toLowerCase()}
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Drag indicator */}
      {!isDragEnabled && (
        <div className="text-sm text-muted-foreground">
          ℹ️ Drag-and-drop is disabled when filters or sorting are applied
        </div>
      )}


      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {filteredTodos.length === 0 ? (
              <EmptyState
                icon={ListTodo}
                message={
                  hasActiveFilters
                    ? "No todos found matching your filters."
                    : "Nothing to learn? Impossible!"
                }
              />
            ) : (
              filteredTodos.map((todo) => (
                <SortableTodoCard
                  key={todo.id}
                  todo={todo}
                  priorityColors={priorityColors}
                  statusColors={statusColors}
                  handleStatusChange={handleStatusChange}
                  completeMutation={completeMutation}
                  deleteMutation={deleteMutation}
                  isDragEnabled={isDragEnabled}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSubmit={(values) => addMutation.mutate(values)}
        isPending={addMutation.isPending}
      />
    </div>
  );
};

export default TodosView;
