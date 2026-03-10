import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readingTime } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; versionId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  const userId = (session.user as { id?: string }).id;

  const { slug, versionId } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (role !== "ADMIN" && post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const version = await prisma.postVersion.findFirst({
    where: { id: versionId, postId: post.id },
  });
  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  return NextResponse.json(version);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; versionId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  const userId = (session.user as { id?: string }).id;

  const { slug, versionId } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (role !== "ADMIN" && post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const version = await prisma.postVersion.findFirst({
    where: { id: versionId, postId: post.id },
  });
  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

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

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: {
      title: version.title,
      content: version.content,
      excerpt: version.excerpt,
      coverImage: version.coverImage,
      readingTime: readingTime(version.content),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(updated);
}
