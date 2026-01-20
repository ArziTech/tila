"use server";

import { auth } from "@/auth";
import type { Todo } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

export async function getTodos(): Promise<ActionResponse<Todo[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
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

export async function addTodo(values: {
  title: string;
}): Promise<ActionResponse<Todo>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const { title } = values;

    const todo = await prisma.todo.create({
      data: {
        title,
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

export async function updateTodo(values: {
  id: string;
  completed: boolean;
}): Promise<ActionResponse<Todo>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const { id, completed } = values;

    const todo = await prisma.todo.update({
      where: { id, userId: session.user.id },
      data: { completed },
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
