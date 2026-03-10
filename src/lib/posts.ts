import { prisma } from "@/lib/prisma";

export type PostPreview = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  author: { name: string | null };
  category?: { name: string; slug: string } | null;
  tags?: { id: string; name: string; slug: string }[];
};

export async function getRecentPosts(limit = 6): Promise<PostPreview[]> {
  try {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return posts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    readingTime: p.readingTime,
    author: p.author,
    category: p.category,
    tags: p.tags,
  }));
  } catch {
    return [];
  }
}

export async function getPostCount(): Promise<number> {
  try {
    return prisma.post.count({ where: { status: "PUBLISHED" } });
  } catch {
    return 0;
  }
}

export async function getCategoryCount(): Promise<number> {
  try {
    return prisma.category.count();
  } catch {
    return 0;
  }
}
