import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { Clock, ListTodo, Plus, X } from "lucide-react";
import EmptyState from "./empty-state";

// --- Todos View ---
const TodosView = ({ todos, categories, onComplete, onDelete, onAdd }: any) => {
  const priorityColors: Record<number, string> = {
    1: "bg-red-100 text-red-700 border-red-200",
    2: "bg-yellow-100 text-yellow-700 border-yellow-200",
    3: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Learning Backlog</h2>
        <Button onClick={onAdd}>
          <Plus size={20} /> Add Item
        </Button>
      </div>
      <div className="grid gap-4">
        {todos.length === 0 ? (
          <EmptyState icon={ListTodo} message="Nothing to learn? Impossible!" />
        ) : (
          todos.map((todo: any) => {
            const cat = categories.find((c: any) => c.id === todo.categoryId);
            return (
              <Card
                key={todo.id}
                className="hover:shadow-md transition border-l-4"
                style={{ borderLeftColor: cat?.color || "#ddd" }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${priorityColors[todo.priority]}`}
                      >
                        {todo.priority === 1
                          ? "High Priority"
                          : todo.priority === 2
                            ? "Medium"
                            : "Low"}
                      </span>
                      {cat && (
                        <span className="text-xs text-gray-500">
                          • {cat.name}
                        </span>
                      )}
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
                      onClick={() => onComplete(todo.id)}
                    >
                      Done
                    </Button>
                    <Button
                      variant="ghost"
                      className="!px-3 !py-1 text-red-500"
                      onClick={() => onDelete(todo.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodosView;
