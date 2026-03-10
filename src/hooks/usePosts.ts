export type Post = {
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
