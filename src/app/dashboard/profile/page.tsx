"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getProfilePageData } from "@/actions/dashboard";
import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AvatarSelection } from "./_components/avatar-selection";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).optional().or(z.literal("")),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(20, {
    message: "Username must not exceed 20 characters.",
  }).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Username can only contain letters, numbers, underscores, and hyphens.",
  }).optional().or(z.literal("")),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  image: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
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
      username: "",
      email: "",
      image: "",
    },
  });

  useEffect(() => {
    if (profileData?.data?.user) {
      const user = profileData.data.user;
      form.reset({
        name: user.name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
      });
    }
  }, [profileData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (session?.user?.id) {
      // Build update data object with only non-empty fields
      const updateData: { name?: string; username?: string; email?: string; image?: string } = {};

      if (data.name && data.name.trim() !== "") {
        updateData.name = data.name.trim();
      }
      if (data.username && data.username.trim() !== "") {
        updateData.username = data.username.trim();
      }
      if (data.email && data.email.trim() !== "") {
        updateData.email = data.email.trim();
      }
      if (data.image && data.image.trim() !== "") {
        updateData.image = data.image.trim();
      }

      const response = await updateUserProfile(session.user.id, updateData);

      if (response.status === "SUCCESS") {
        await update({
          ...session,
          user: { ...session.user, ...updateData },
        });
        form.reset(data);
        toast.success("Profile updated successfully!");
      } else {
        console.error("Error updating profile:", response.error);
        toast.error(response.error || "Failed to update profile.");
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

  if (isError || profileData?.status === "ERROR" || !profileData) {
    return <div>Error loading profile data.</div>;
  }

  const { user, stats } = profileData.data ?? {};

  // Helper function to format member since date
  const formatMemberSince = (date: Date | null | undefined) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Helper function to format relative time
  const formatRelativeTime = (date: Date | null | undefined) => {
    if (!date) return "Unknown";
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Helper function to format email verification status
  const formatEmailVerification = (verified: Date | null | undefined) => {
    if (!verified) return null;
    return `Verified ${formatRelativeTime(verified)}`;
  };

  // Handle verify account button click
  const handleVerifyAccount = () => {
    toast.info("Verification feature not ready yet. Stay tuned!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* User Information Section - Merged */}
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">User Information</h2>

        <div className="space-y-8">
          {/* Avatar and User ID */}
          <div className="flex flex-col items-center space-y-3">
            <AvatarSelection avatarOptions={avatarOptions} />
            <p className="text-xs text-muted-foreground font-mono">ID: {user?.id || "N/A"}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name that will be displayed on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your unique username for mentions and sharing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <div className="flex flex-col gap-2">
                      <FormDescription>
                        We'll use this email for account notifications.
                      </FormDescription>
                      {user?.emailVerified ? (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          ✓ {formatEmailVerification(user.emailVerified)}
                        </p>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleVerifyAccount}
                          className="w-fit"
                        >
                          Verify Account
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Or select an emoji avatar above for a quick option.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Info - Read Only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Member Since</p>
                  <p className="text-sm font-medium">{formatMemberSince(user?.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Last Updated</p>
                  <p className="text-sm font-medium">{formatRelativeTime(user?.updatedAt)}</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {stats && (
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
      )}

      {stats && (
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
      )}
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
