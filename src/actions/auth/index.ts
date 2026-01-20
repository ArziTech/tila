"use server";
import bcrypt from "bcryptjs";
import type zod from "zod";
import { signIn, signOut } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import type { ActionResponse } from "@/types/utils";
import { createUser, getUserByEmail } from "../user";

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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    throw error;
  }

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

    // const codeResponse = await getVerificationTokensByEmail(email);
    // if (codeResponse.status === "ERROR" || !codeResponse.data) {
    //   return { status: "ERROR", error: "Problem with code" };
    // }

    // const newestCode = codeResponse.data[0];
    // if (code !== newestCode.token) {
    //   return { status: "ERROR", error: "Code doesn't match" };
    // }

    // const currentTime = new Date();
    // const expirationTime = new Date(newestCode.expires);

    // if (currentTime > expirationTime) {
    //   return { status: "ERROR", error: "Code has expired" };
    // }

    await createUser({
      name,
      username: name,
      email,
      password: hashedPassword,
    });

    // await deleteVerificationTokensByEmail(email);

    return {
      status: "SUCCESS",
      success: `Congratulations!!! Your Account has successfully created.`,
    };
  } catch {
    // just in case
    return {
      status: "ERROR",
      success: `Something went wrong`,
    };
  }
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/login" });
};
