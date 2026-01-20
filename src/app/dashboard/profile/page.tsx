"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getProfilePageData } from "@/actions/dashboard";
import { updateUserProfile } from "@/actions/user";
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

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  avatar: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePanel() {
  const { data: session, status: sessionStatus, update } = useSession();

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile-stats"],
    queryFn: async () => getProfilePageData(),
    enabled: sessionStatus === "authenticated",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name ?? "",
        avatar: session.user.image ?? "",
      });
    }
  }, [session, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (session?.user?.id) {
      const response = await updateUserProfile(session.user.id, {
        username: data.name,
        image: data.avatar,
      });

      if (response.status === "SUCCESS") {
        await update({
          ...session,
          user: { ...session.user, name: data.name, image: data.avatar },
        });
        form.reset(data);
      } else {
        console.error("Error updating profile:", response.error);
      }
    }
  };

  const avatarOptions = [
    "🎓",
    "🚀",
    "💡",
    "🎯",
    "📚",
    "⭐",
    "🏆",
    "🌟",
    "✨",
    "🎨",
  ];

  if (sessionStatus === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (sessionStatus === "unauthenticated") {
    return <div>You must be signed in to view this page.</div>;
  }

  if (isError || profileData?.status === "ERROR") {
    return <div>Error loading profile data.</div>;
  }

  const { stats } = profileData.data;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">Your Profile</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Avatar</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-3">
                      {avatarOptions.map((avatar) => (
                        <button
                          type="button"
                          key={avatar}
                          onClick={() => field.onChange(avatar)}
                          className={`text-4xl p-3 rounded-lg border-2 transition ${
                            field.value === avatar
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Save changes
            </Button>
          </form>
        </Form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBox title="Total Points" value={stats.totalPoints} icon="⭐" />
        <StatBox
          title="Current Streak"
          value={stats.currentStreak}
          icon="🔥"
          suffix="days"
        />
        <StatBox
          title="Longest Streak"
          value={stats.longestStreak}
          icon="🏆"
          suffix="days"
        />
        <StatBox title="Total Learnings" value={stats.learnings} icon="📚" />
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-primary">Learning Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Categories Explored</span>
            <span className="font-semibold">{stats.uniqueCategories}</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Advanced Learnings</span>
            <span className="font-semibold text-destructive">
              {stats.advancedCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Intermediate Learnings
            </span>
            <span className="font-semibold text-secondary">
              {stats.intermediateCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Beginner Learnings</span>
            <span className="font-semibold text-success">
              {stats.beginnerCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatBoxProps {
  title: string;
  value: number;
  icon: string;
  suffix?: string;
}

function StatBox({ title, value, icon, suffix }: StatBoxProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm text-center">
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {title} {suffix && `(${suffix})`}
      </p>
    </div>
  );
}
