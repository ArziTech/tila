"use server";

import { auth } from "@/auth";
import {
  isEmailVerificationRequired,
  sendVerificationEmail,
} from "@/lib/email";
import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/types/utils";
import crypto from "node:crypto";

/**
 * Generate a secure random verification token
 */
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Calculate token expiration date (24 hours from now)
 */
function getTokenExpiration(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
}

/**
 * Resend verification email to the current user
 */
export async function resendVerificationEmail(): Promise<ActionResponse<null>> {
  try {
    // Check if email verification is required
    if (!isEmailVerificationRequired()) {
      return {
        status: "ERROR",
        error: "Email verification is disabled",
      };
    }

    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return { status: "ERROR", error: "Unauthorized" };
    }

    // Check if user is already verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { status: "ERROR", error: "User not found" };
    }

    if (user.emailVerified) {
      return {
        status: "ERROR",
        error: "Email is already verified",
      };
    }

    // Generate new verification token
    const token = generateVerificationToken();
    const tokenExpires = getTokenExpiration();

    // Update user with new token
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: tokenExpires,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail({
      email: user.email,
      token,
    });

    if (!emailResult.success) {
      console.log("Failed to send verification email");
      return {
        status: "ERROR",
        error: "Failed to send verification email",
      };
    }

    return {
      status: "SUCCESS",
      success: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      status: "ERROR",
      error: "Failed to resend verification email",
    };
  }
}

/**
 * Verify email using token from URL
 */
export async function verifyEmailToken(
  token: string,
): Promise<ActionResponse<{ userId: string }>> {
  try {
    if (!token) {
      return { status: "ERROR", error: "Invalid verification token" };
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return { status: "ERROR", error: "Invalid verification token" };
    }

    // Check if token has expired
    if (
      !user.verificationTokenExpires ||
      new Date() > user.verificationTokenExpires
    ) {
      return { status: "ERROR", error: "Verification token has expired" };
    }

    // Check if already verified
    if (user.emailVerified) {
      return {
        status: "ERROR",
        error: "Email is already verified",
      };
    }

    // Verify email and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return {
      status: "SUCCESS",
      success: "Email verified successfully",
      data: { userId: user.id },
    };
  } catch (error) {
    console.error("Error verifying email token:", error);
    return {
      status: "ERROR",
      error: "Failed to verify email",
    };
  }
}
