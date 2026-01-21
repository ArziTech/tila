"use server";

import { auth } from "@/auth";
import type { Category, Todo, TodoStatus } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

export async function getTodos(): Promise<
  ActionResponse<(Todo & { category: Category | null })[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return {
      status: "SUCCESS",
      data: todos,
    };
  } catch (error) {
    console.error("Error fetching todos:", error);
    return { status: "ERROR", error: "Failed to fetch todos" };
  }
}

export async function getTodo(
  id: string,
): Promise<ActionResponse<Todo & { category: Category | null }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const todo = await prisma.todo.findUnique({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!todo) {
      return { status: "ERROR", error: "Todo not found" };
    }

    return {
      status: "SUCCESS",
      data: todo,
    };
  } catch (error) {
    console.error("Error fetching todo:", error);
    return { status: "ERROR", error: "Failed to fetch todo" };
  }
}

interface AddTodoValues {
  title: string;
  content?: string;
  categoryId?: string;
  priority?: number;
  dueDate?: Date;
  estimatedDuration?: number;
}

export async function addTodo(
  values: AddTodoValues,
): Promise<ActionResponse<Todo>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Check email verification
    if (!session.user.emailVerified) {
      return {
        status: "ERROR",
        error: "Please verify your email address before creating todos",
      };
    }

    const { title, content, categoryId, priority, dueDate, estimatedDuration } =
      values;

    // Get the highest order value for this user
    const maxOrder = await prisma.todo.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = (maxOrder?.order ?? -1) + 1;

    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        categoryId,
        priority: priority ?? 3,
        dueDate,
        estimatedDuration,
        order: newOrder,
        userId: session.user.id,
      },
    });

    return {
      status: "SUCCESS",
      data: todo,
    };
  } catch (error) {
    console.error("Error adding todo:", error);
    return { status: "ERROR", error: "Failed to add todo" };
  }
}

interface UpdateTodoValues {
  title?: string;
  content?: string;
  status?: TodoStatus;
  categoryId?: string;
  priority?: number;
  dueDate?: Date;
  estimatedDuration?: number;
}

export async function updateTodo(params: {
  id: string,
  values: UpdateTodoValues,

}): Promise<ActionResponse<Todo>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const newStatus: TodoStatus = params.values.status || 'ONGOING'

    const todo = await prisma.todo.update({
      where: { id: params.id, userId: session.user.id },
      data: { ...params.values, status: newStatus },
    });

    return {
      status: "SUCCESS",
      data: todo,
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    return { status: "ERROR", error: "Failed to update todo" };
  }
}

export async function deleteTodo(id: string): Promise<ActionResponse<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    await prisma.todo.delete({
      where: { id, userId: session.user.id },
    });

    return {
      status: "SUCCESS",
    };
  } catch (error) {
    console.error("Error deleting todo:", error);
    return { status: "ERROR", error: "Failed to delete todo" };
  }
}

export async function reorderTodos(
  todoIds: string[],
): Promise<ActionResponse<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Update each todo with its new order
    await Promise.all(
      todoIds.map((id, index) =>
        prisma.todo.update({
          where: { id, userId: session.user.id },
          data: { order: index },
        }),
      ),
    );

    return {
      status: "SUCCESS",
    };
  } catch (error) {
    console.error("Error reordering todos:", error);
    return { status: "ERROR", error: "Failed to reorder todos" };
  }
}

export async function completeTodo(
  id: string,
): Promise<ActionResponse<{ todo: Todo; item: { id: string } | null }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Get the todo to check if it has a category
    const existingTodo = await prisma.todo.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingTodo) {
      return { status: "ERROR", error: "Todo not found" };
    }

    // Update todo as completed
    const todo = await prisma.todo.update({
      where: { id, userId: session.user.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // If todo has a category and content, create a new Item
    let newItem: { id: string } | null = null;

    if (existingTodo.categoryId && existingTodo.content) {
      const item = await prisma.item.create({
        data: {
          title: existingTodo.title,
          description: existingTodo.content,
          topic: "Learning", // Default topic, can be customized
          difficulty: "beginner", // Default difficulty, can be customized
          categoryId: existingTodo.categoryId,
          userId: session.user.id,
          duration_minutes: existingTodo.estimatedDuration ?? 0,
          tags: [], // Empty tags by default
        },
        select: { id: true },
      });

      newItem = item;

      // Link the item to the todo
      await prisma.todo.update({
        where: { id },
        data: { itemId: item.id },
      });
    }

    return {
      status: "SUCCESS",
      data: { todo, item: newItem },
    };
  } catch (error) {
    console.error("Error completing todo:", error);
    return { status: "ERROR", error: "Failed to complete todo" };
  }
}
