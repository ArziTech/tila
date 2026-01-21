import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    termsAgreed: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    // code: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
