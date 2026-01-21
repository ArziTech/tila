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

      <p className="text-center text-sm text-gray-600 mb-6">
        Welcome back! Sign in to continue your learning journey.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {urlError && <div className="text-red-500">{urlError}</div>}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign up
            </Link>
          </div>
          <Button
            variant={"gradient"}
            type="submit"
            className="w-full py-3 mt-2"
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
