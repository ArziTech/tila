"use client";

import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";

interface AvatarSelectionProps {
  avatarOptions: string[];
}

export function AvatarSelection({ avatarOptions }: AvatarSelectionProps) {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(session?.user?.image);
  const [isPending, startTransition] = useTransition();
  // Local optimistic state that updates immediately
  const [optimisticAvatar, setOptimisticAvatar] = useState(session?.user?.image);

  // Use optimistic avatar if available, otherwise fall back to session avatar
  const currentAvatar = optimisticAvatar ?? session?.user?.image;

  const handleSave = async () => {
    if (session?.user?.id && selectedAvatar) {
      // Immediately update the UI
      setOptimisticAvatar(selectedAvatar);
      setIsEditing(false);

      // Update in background
      startTransition(async () => {
        const response = await updateUserProfile(session.user.id, {
          image: selectedAvatar,
        });

        if (response.status === "SUCCESS") {
          // Sync session with server
          await update();
          toast.success("Avatar updated successfully!");
        } else {
          // Revert on error
          setOptimisticAvatar(session.user.image);
          toast.error("Failed to update avatar.");
        }
      });
    }
  };

  if (!currentAvatar && !isEditing) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose Avatar
        </p>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg border-2 border-dashed border-destructive flex items-center justify-center">
            <AlertTriangle className="text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-destructive">
              No avatar selected.
            </p>
            <p className="text-sm text-muted-foreground">
              Please choose an avatar to represent you.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto mt-1"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Choose Avatar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Choose Avatar
        </p>
        <div className="flex flex-wrap gap-3">
          {avatarOptions.map((avatar) => (
            <button
              type="button"
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`text-4xl p-3 rounded-lg border-2 transition ${selectedAvatar === avatar
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary"
                }`}
            >
              {avatar}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={selectedAvatar === currentAvatar || isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setSelectedAvatar(currentAvatar);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Your Avatar
      </p>
      <div className="flex items-center gap-4">
        <div className="text-7xl">{currentAvatar}</div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
        >
          Change
        </Button>
      </div>
    </div>
  );
}
