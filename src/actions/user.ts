"use server";
import type { User } from "@/generated/prisma/client";
import type { UserCreateInput } from "@/generated/prisma/models/User";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";

export async function createUser(
  input: UserCreateInput,
): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.create({ data: input });

    if (!user) return { status: "ERROR", error: "User doesn't exist" };

    return {
      status: "SUCCESS",
      success: "Success creating new user",
      data: user,
    };
  } catch (_error) {
    // return prismaErrorChecker(error);
    return {
      status: "ERROR",
    };
  }
}

export async function getUserById(id: string): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      // include: {
      //   roles: true,
      // },
    });

    if (!user) return { status: "ERROR", error: "User doesn't exist" };

    return {
      status: "SUCCESS",
      success: "Success fetching the user",
      data: user,
    };
  } catch (_error) {
    // return prismaErrorChecker(error);
    // return error;
    return {
      status: "ERROR",
    };
  }
}

export async function getUserByEmail(
  email: string,
): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return { status: "ERROR", error: "User doesn't exist" };

    return {
      status: "SUCCESS",
      success: "Success fetching the user",
      data: user,
    };
  } catch (_error) {
    return {
      status: "ERROR",
    };
    // return prismaErrorChecker(error);
    // return error;
  }
}

export async function setUsername(
  userId: string,
  username: string,
): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    if (!user) return { status: "ERROR", error: "User doesn't exist" };

    return {
      status: "SUCCESS",
      success: "Success setting new username",
      data: user,
    };
  } catch (_error) {
    // return prismaErrorChecker(error);
    return {
      status: "ERROR",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  data: { username?: string; image?: string },
): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    if (!user) return { status: "ERROR", error: "User doesn't exist" };

    return {
      status: "SUCCESS",
      success: "Success updating user profile",
      data: user,
    };
  } catch (_error) {
    return {
      status: "ERROR",
    };
  }
}
