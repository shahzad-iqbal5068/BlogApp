import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing_token", req.url));
  }

  const sub = await prisma.newsletterSubscriber.findUnique({
    where: { token },
  });
  if (!sub) {
    return NextResponse.redirect(new URL("/?error=invalid_token", req.url));
  }

  await prisma.newsletterSubscriber.update({
    where: { id: sub.id },
    data: { active: false },
  });

  return NextResponse.redirect(new URL("/?unsubscribed=1", req.url));
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { error: "Token required" },
        { status: 400 }
      );
    }

    const sub = await prisma.newsletterSubscriber.findUnique({
      where: { token },
    });
    if (!sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: sub.id },
      data: { active: false },
    });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Unsubscribe failed" },
      { status: 500 }
    );
  }
}
