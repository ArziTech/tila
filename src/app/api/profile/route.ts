import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { id, username, avatar_url } = await request.json();

  if (!id || !username || !avatar_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const profile = await prisma.profile.create({
      data: {
        id: id,
        username,
        avatar_url,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 },
    );
  }
}
