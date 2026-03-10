import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  if (CRON_SECRET && req.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { gte: weekAgo },
    },
    include: {
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://blogapp.com";
  const unsubscribeBase = `${baseUrl}/api/newsletter/unsubscribe`;

  const sent: string[] = [];
  const failed: string[] = [];

  for (const sub of subscribers) {
    try {
      const html = buildDigestHtml(posts, baseUrl, `${unsubscribeBase}?token=${sub.token}`);
      await sendEmail(sub.email, "Weekly Blog Digest", html);
      sent.push(sub.email);
    } catch (e) {
      console.error("Digest send failed:", sub.email, e);
      failed.push(sub.email);
    }
  }

  return NextResponse.json({
    sent: sent.length,
    failed: failed.length,
    posts: posts.length,
    subscribers: subscribers.length,
  });
}

function buildDigestHtml(
  posts: { title: string; slug: string; excerpt: string | null; publishedAt: Date | null; author: { name: string | null } }[],
  baseUrl: string,
  unsubscribeUrl: string
): string {
  const items = posts
    .map(
      (p) => `
    <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
      <h2 style="margin: 0 0 8px 0; font-size: 18px;">
        <a href="${baseUrl}/blog/${p.slug}" style="color: #3B82F6; text-decoration: none;">${escapeHtml(p.title)}</a>
      </h2>
      ${p.excerpt ? `<p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${escapeHtml(p.excerpt)}</p>` : ""}
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        ${p.author?.name || "Anonymous"} · ${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}
      </p>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Weekly Digest</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h1 style="margin-bottom: 24px;">This week on the blog</h1>
  ${items}
  <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
    <a href="${unsubscribeUrl}" style="color: #94a3b8;">Unsubscribe</a> from this newsletter
  </p>
</body>
</html>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set - skipping email send");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Blog <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}
