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

  const categories = await prisma.category.findMany({
    where: { profileId: user.id },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure a profile exists for the user
  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      username: user.email?.split("@")[0] || "New User", // Default username
      avatar_url: "😊", // Default avatar
    },
  });

  const { name, color } = await request.json();

  const category = await prisma.category.create({
    data: {
      name,
      color,
      profileId: profile.id,
    },
  });

  return NextResponse.json(category);
}
