'use client'
import { useState } from "react";
import TodosView from "../_components/todos-view";
import { Todo } from "@/types";
import { useLearning } from "@/context/learning-context";

const Todos = () => {
  const { categories } = useLearning()
  const [todos, setTodos] = useState<Todo[]>([]);


  return (
    <TodosView
      todos={todos}
      categories={categories}
      onComplete={() => { }}
      onDelete={(id: string) => {
        const newTodos = todos.filter(t => t.id !== id);
        setTodos(newTodos);
      }}
      onAdd={() => { }}
    />
  )
}

export default Todos;
