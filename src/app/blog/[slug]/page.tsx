import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostContent from "@/components/PostContent";
import TableOfContents from "@/components/TableOfContents";
import AIExplainButton from "@/components/AIExplainButton";
import AISummaryButton from "@/components/AISummaryButton";
import AnimatedContent from "@/components/AnimatedContent";
import { extractHeadings } from "@/lib/utils";

async function getPost(slug: string) {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/posts/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const tocItems = extractHeadings(post.content);

  return (
    <article className="mx-auto max-w-6xl px-6 py-16">
      <AnimatedContent>
        <Link
          href="/blog"
          className="mb-8 inline-block text-sm text-[#3B82F6] transition-colors hover:underline"
        >
          ← Back to Blog
        </Link>
        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
        <div>
          <header className="mb-10">
            {post.coverImage && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            )}
            <h1 className="font-heading text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
              <span>{post.author?.name || "Anonymous"}</span>
              {post.publishedAt && (
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              )}
              {post.readingTime && (
                <span>{post.readingTime} min read</span>
              )}
            </div>
          </header>
          <div className="flex flex-wrap gap-4">
            <AIExplainButton content={post.content} />
            <AISummaryButton content={post.content} />
          </div>
          <PostContent content={post.content} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>
      </AnimatedContent>
    </article>
  );
}
