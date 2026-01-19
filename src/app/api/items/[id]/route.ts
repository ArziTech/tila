import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: { category: true },
  });
  return NextResponse.json(item);
}
