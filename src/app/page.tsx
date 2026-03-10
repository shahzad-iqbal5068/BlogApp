import Image from "next/image";
import Link from "next/link";
import { getRecentPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getRecentPosts(6);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
        {/* Hero */}
        <section className="mb-20 text-center">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Welcome to BlogApp
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Discover stories, ideas, and insights. We write about technology,
            tutorials, and building things with modern tools.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[#3B82F6] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#2563eb]"
          >
            Browse all posts
          </Link>
        </section>

        {/* Recent posts */}
        <section>
          <h2 className="font-heading mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Recent posts
          </h2>
          {posts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
              No posts yet. Check back soon or{" "}
              <Link href="/blog" className="text-[#3B82F6] hover:underline">
                explore the blog
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-slate-600"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {post.coverImage && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={400}
                          height={220}
                          className="h-44 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-semibold text-slate-900 transition-colors group-hover:text-[#3B82F6] dark:text-slate-50 dark:group-hover:text-[#3B82F6]">
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{post.author?.name || "Anonymous"}</span>
                    {post.publishedAt && (
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                    {post.readingTime && (
                      <span>{post.readingTime} min read</span>
                    )}
                    {post.category && (
                      <Link
                        href={`/blog?category=${post.category.slug}`}
                        className="text-[#3B82F6] hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          {posts.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#3B82F6] font-medium hover:underline"
              >
                View all posts
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
