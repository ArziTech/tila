import bcrypt from "bcryptjs";
// import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import { getUserByEmail } from "@/actions/user";
// import { env } from "@/lib/env";
import { loginSchema } from "@/lib/schemas/auth";

export default {
  providers: [
    // Google({
    //   clientId: env.AUTH_GOOGLE_ID,
    //   clientSecret: env.AUTH_GOOGLE_SECRET,
    // }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const response = await getUserByEmail(email);

          if (
            response.status !== "SUCCESS" ||
            !response.data ||
            !response.data.password
          ) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            response.data.password,
          );

          if (passwordMatch) {
            return response.data;
          }

          // TODO: Delete this just for development
          if (process.env.NODE_ENV === "development") {
            const passwordMatch = password === response.data.password;
            if (passwordMatch) {
              return response.data;
            }
          }
        }

        return null; // if return null, will be counted as an error
      },
    }),
  ],
};
