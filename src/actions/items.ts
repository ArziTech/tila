"use server";

import { auth } from "@/auth";
import type { Category, Item } from "@/generated/prisma/client";
import { recordDailyActivityPoints } from "@/lib/gamification";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";
import {
  awardCompletionRewards,
  checkAndUpdateDailyStreak,
  POINTS,
  updateCategoryCount,
} from "@/lib/gamification";

export async function getItems(): Promise<
  ActionResponse<(Item & { category: Category | null })[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const items = await prisma.item.findMany({
      where: { userId: session.user.id },
      include: { category: true },
    });

    return {
      status: "SUCCESS",
      data: items,
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { status: "ERROR", error: "Failed to fetch items" };
  }
}

export async function getItem(
  id: string,
): Promise<ActionResponse<Item & { category: Category | null }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const item = await prisma.item.findUnique({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!item) {
      return { status: "ERROR", error: "Item not found" };
    }

    return {
      status: "SUCCESS",
      data: item,
    };
  } catch (error) {
    console.error("Error fetching item:", error);
    return { status: "ERROR", error: "Failed to fetch item" };
  }
}

export async function deleteItem(id: string): Promise<ActionResponse<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    await prisma.item.delete({
      where: { id, userId: session.user.id },
    });

    return {
      status: "SUCCESS",
    };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { status: "ERROR", error: "Failed to delete item" };
  }
}

interface AddItemValues {
  title: string;
  description: string;
  categoryId: string;
  topic: string;
  difficulty: string;
  tags: string[];
  duration_minutes: number;
}

export async function addItem(
  values: AddItemValues,
): Promise<ActionResponse<Item>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Check email verification
    if (!session.user.emailVerified) {
      return {
        status: "ERROR",
        error: "Please verify your email address before creating items",
      };
    }

    const {
      title,
      description,
      categoryId,
      topic,
      difficulty,
      tags,
      duration_minutes,
    } = values;

    // Create item and award points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: {
          title,
          description,
          categoryId,
          topic,
          difficulty,
          tags,
          duration_minutes,
          userId: session.user.id,
        },
      });

      // Award points for creating an item
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          total_points: {
            increment: POINTS.CREATE_ITEM,
          },
        },
      });

      // Record daily activity
      await recordDailyActivityPoints(tx, session.user.id, POINTS.CREATE_ITEM);

      return item;
    });

    // Update category count and streak outside transaction
    await updateCategoryCount(session.user.id);
    await checkAndUpdateDailyStreak(session.user.id);

    return {
      status: "SUCCESS",
      data: result,
    };
  } catch (error) {
    console.error("Error adding item:", error);
    return { status: "ERROR", error: "Failed to add item" };
  }
}

interface UpdateItemValues {
  title?: string;
  description?: string;
  categoryId?: string;
  topic?: string;
  difficulty?: string;
  tags?: string[];
  duration_minutes?: number;
}

export async function updateItem(
  id: string,
  values: UpdateItemValues,
): Promise<ActionResponse<Item>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    const item = await prisma.item.update({
      where: { id, userId: session.user.id },
      data: values,
    });

    return {
      status: "SUCCESS",
      data: item,
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return { status: "ERROR", error: "Failed to update item" };
  }
}

/**
 * Completes an item and awards gamification rewards
 * Awards points based on difficulty, updates streak, difficulty count, and category count
 * @param id - The item ID to complete
 * @returns The completed item
 */
export async function completeItem(
  id: string,
): Promise<ActionResponse<Item & { category: Category | null }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Get the item first to check difficulty
    const item = await prisma.item.findUnique({
      where: { id, userId: session.user.id },
      include: { category: true },
    });

    if (!item) {
      return { status: "ERROR", error: "Item not found" };
    }

    // Award completion rewards (points, streak, difficulty count, category count)
    await awardCompletionRewards(session.user.id, item.difficulty);

    return {
      status: "SUCCESS",
      data: item,
    };
  } catch (error) {
    console.error("Error completing item:", error);
    return { status: "ERROR", error: "Failed to complete item" };
  }
}
