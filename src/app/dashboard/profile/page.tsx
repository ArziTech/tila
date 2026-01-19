"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePanel() {
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "", avatar: "" });
  const [editedName, setEditedName] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");

  const getProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile({ name: data.username, avatar: data.avatar_url });
        setEditedName(data.username);
        setEditedAvatar(data.avatar_url);
      }
    }
  }, [supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: editedName,
          avatar_url: editedAvatar,
        })
        .eq("id", user.id);
      if (error) {
        console.error("Error updating profile:", error);
      } else {
        setProfile({ name: editedName, avatar: editedAvatar });
        setIsEditing(false);
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

  // Hardcoded stats for now, as they are not in the database
  const uniqueCategories = 5;
  const advancedCount = 2;
  const intermediateCount = 8;
  const beginnerCount = 10;
  const profileStats = {
    totalPoints: 1250,
    currentStreak: 12,
    longestStreak: 25,
    learnings: 20,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">Your Profile</h2>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-7xl">{profile.avatar}</div>
              <div>
                <h3 className="text-3xl font-bold">{profile.name}</h3>
                <p className="text-muted-foreground">Learning Enthusiast</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground font-medium rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="avatar-1"
                className="block text-sm font-medium mb-3"
              >
                Choose Avatar
              </label>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((avatar, index) => (
                  <button
                    id={index === 0 ? "avatar-1" : undefined}
                    type="button"
                    key={avatar}
                    onClick={() => setEditedAvatar(avatar)}
                    className={`text-4xl p-3 rounded-lg border-2 transition ${
                      editedAvatar === avatar
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-medium py-2 rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedName(profile.name);
                  setEditedAvatar(profile.avatar);
                  setIsEditing(false);
                }}
                className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatBox
          title="Total Points"
          value={profileStats.totalPoints}
          icon="⭐"
        />
        <StatBox
          title="Current Streak"
          value={profileStats.currentStreak}
          icon="🔥"
          suffix="days"
        />
        <StatBox
          title="Longest Streak"
          value={profileStats.longestStreak}
          icon="🏆"
          suffix="days"
        />
        <StatBox
          title="Total Learnings"
          value={profileStats.learnings}
          icon="📚"
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-primary">Learning Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Categories Explored</span>
            <span className="font-semibold">{uniqueCategories}</span>
          </div>
          <div className="border-t border-border"></div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Advanced Learnings</span>
            <span className="font-semibold text-destructive">
              {advancedCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Intermediate Learnings
            </span>
            <span className="font-semibold text-secondary">
              {intermediateCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Beginner Learnings</span>
            <span className="font-semibold text-success">{beginnerCount}</span>
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
