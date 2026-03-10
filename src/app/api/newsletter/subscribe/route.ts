import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json({
          message: "Already subscribed",
          subscribed: true,
        });
      }
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { active: true, token },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: { email: normalized, token, active: true },
      });
    }

    return NextResponse.json({
      message: "Subscribed successfully",
      subscribed: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
