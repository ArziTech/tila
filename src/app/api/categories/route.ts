import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

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

  const { name, color } = await request.json();

  const category = await prisma.category.create({
    data: {
      name,
      color,
      profileId: user.id,
    },
  });

  return NextResponse.json(category);
}
