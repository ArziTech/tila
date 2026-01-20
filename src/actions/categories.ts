"use server";

import { auth } from "@/auth";
import type { Category } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

export async function getCategories(): Promise<
  ActionResponse<(Category & { _count: { items: number } })[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return {
      status: "SUCCESS",
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { status: "ERROR", error: "Failed to fetch categories" };
  }
}

export async function addCategory(values: {
  name: string;
  color: string;
}): Promise<ActionResponse<Category>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const { name, color } = values;

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: session.user.id,
      },
    });

    return {
      status: "SUCCESS",
      data: category,
    };
  } catch (error) {
    console.error("Error adding category:", error);
    return { status: "ERROR", error: "Failed to add category" };
  }
}
