import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      username: user.email?.split("@")[0] || "New User", // Default username
      avatar_url: "😊", // Default avatar
    },
  });

  const items = await prisma.item.findMany({
    where: { profileId: user.id },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayHours =
    items
      .filter((item) => new Date(item.date_added) >= today)
      .reduce((acc, item) => acc + item.duration_minutes, 0) / 60;

  const totalHours =
    items.reduce((acc, item) => acc + item.duration_minutes, 0) / 60;

  const stats = {
    currentStreak: profile?.current_streak || 0,
    todayHours,
    totalHours,
    totalLogs: items.length,
    level: Math.floor((profile?.total_points || 0) / 1000),
  };

  return NextResponse.json({ profile, items, stats });
}
