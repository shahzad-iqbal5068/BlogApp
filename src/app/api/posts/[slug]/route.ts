import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readingTime } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const canViewDraft =
    role === "ADMIN" || (role === "AUTHOR" && post.authorId === userId);
  if (post.status === "DRAFT" && !canViewDraft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  const userId = (session.user as { id?: string }).id;

  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (role !== "ADMIN" && post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, content, excerpt, coverImage, status, categoryId, tagIds } =
      body;

    const lastVersion = await prisma.postVersion.findFirst({
      where: { postId: post.id },
      orderBy: { version: "desc" },
    });
    const nextVersion = (lastVersion?.version ?? 0) + 1;

    await prisma.postVersion.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        version: nextVersion,
        editedBy: userId,
      },
    });

    const data: Record<string, unknown> = {};
    if (title != null) data.title = title;
    if (content != null) {
      data.content = content;
      data.readingTime = readingTime(content);
    }
    if (excerpt != null) data.excerpt = excerpt;
    if (coverImage != null) data.coverImage = coverImage;
    if (status != null) {
      data.status = status;
      if (status === "PUBLISHED" && !post.publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (categoryId != null) data.categoryId = categoryId;
    if (tagIds != null) {
      data.tags = {
        set: tagIds.map((id: string) => ({ id })),
      };
    }

    const updated = await prisma.post.update({
      where: { id: post.id },
      data,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  const userId = (session.user as { id?: string }).id;

  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (role !== "ADMIN" && post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: post.id } });
  return NextResponse.json({ success: true });
}
