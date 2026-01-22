"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerificationSuccessBanner } from "@/components/auth/VerificationSuccessBanner";
import { loginSchema } from "@/lib/schemas/auth";

interface LoginFormProps {
  error?: string;
  verified?: boolean;
}

export function LoginForm({ error, verified }: LoginFormProps) {
  const urlError =
    error === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(values);
      if (response?.error) {
        toast.error(response.error);
      }
      if (response?.success) {
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during sign-in.");
      console.error(error);
    }
  };

  return (
    <div>
      {verified && <VerificationSuccessBanner />}

      <p className="text-center text-sm text-muted-foreground mb-6">
        Welcome back! Sign in to continue your learning journey.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    className="rounded-xl h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-xl h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {urlError && <div className="text-destructive text-center font-medium">{urlError}</div>}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}
