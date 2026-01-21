"use server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type zod from "zod";
import { signIn, signOut } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import type { ActionResponse } from "@/types/utils";
import { createUser, getUserByEmail } from "../user";
import {
  isEmailVerificationRequired,
  sendVerificationEmail,
} from "@/lib/email";

export const login = async (
  values: zod.infer<typeof loginSchema>,
): Promise<Record<string, string>> => {
  const validatedFields = loginSchema.safeParse(values);

  // signIn Action Test 01
  if (!validatedFields.success) {
    return { error: "Something went wrong" };
  }

  const { email, password } = validatedFields.data;

  const response = await getUserByEmail(email);
  const { data: existingUser } = response;
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User not found" };
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationByEmail(
  //     existingUser.email,
  //   );
  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token,
  //   );
  //   return {
  //     success:
  //       "Please verify your email. We've send the verfication link to your email",
  //   };
  // }

  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });

  return { success: "SignIn Succces Welcome Back" };
};
export const registerAction = async (
  values: zod.infer<typeof registerSchema>,
): Promise<ActionResponse<string>> => {
  try {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
      return { status: "ERROR", error: "Invalid fields" };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await getUserByEmail(email);
    const existinguser = response.data;

    if (existinguser) {
      return { status: "ERROR", error: "Email already used" };
    }

    const verificationRequired = isEmailVerificationRequired();

    // Generate verification token (only if verification is required)
    const verificationToken = verificationRequired
      ? crypto.randomBytes(32).toString("hex")
      : null;
    const verificationTokenExpires = verificationRequired
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      : null;
    const emailVerified = verificationRequired ? null : new Date();

    // Create user with verification token or auto-verified
    const userResponse = await createUser({
      name,
      username: name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      emailVerified,
    });

    if (userResponse.status === "ERROR" || !userResponse.data) {
      return {
        status: "ERROR",
        error: "Failed to create user account",
      };
    }

    // Send verification email only if verification is required
    if (verificationRequired) {
      const emailResult = await sendVerificationEmail({
        email,
        token: verificationToken!,
      });

      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
        // Don't fail registration if email fails, just log it
      }

      return {
        status: "SUCCESS",
        success:
          "Account created successfully! Please check your email to verify your account.",
      };
    }

    return {
      status: "SUCCESS",
      success: "Account created successfully! You can now log in.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "ERROR",
      error: "Something went wrong during registration",
    };
  }
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/login" });
};
