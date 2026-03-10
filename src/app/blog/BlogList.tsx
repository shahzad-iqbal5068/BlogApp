"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BlogListSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Post } from "@/hooks/usePosts";

type Category = { id: string; name: string; slug: string };
type Tag = { id: string; name: string; slug: string };
type PostsResponse = { posts: Post[]; pagination: { page: number; pages: number } };

export default function BlogList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCategory(params.get("category") || "");
      setTag(params.get("tag") || "");
    }
  }, []);

  const [searchQ, setSearchQ] = useState("");

  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts", { page, q: searchQ, category, tag, from, to }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (searchQ) params.set("q", searchQ);
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => fetch("/api/tags").then((r) => r.json()),
  });

  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 0 };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQ(q);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-heading mb-8 text-3xl font-semibold text-slate-900 dark:text-slate-50">
        Blog
      </h1>

      <form
        onSubmit={handleSearch}
        className="mb-10 space-y-4"
        role="search"
        aria-label="Search blog posts"
      >
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1"
            aria-label="Search by title or content"
          />
          <Button type="submit">Search</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            aria-label="Filter by tag"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            placeholder="From"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            placeholder="To"
          />
        </div>
      </form>

      {isLoading ? (
        <BlogListSkeleton />
      ) : posts.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          No posts found. Try adjusting your filters.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-10">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                className="group"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                >
                  {post.coverImage && (
                    <motion.div
                      className="mb-4 overflow-hidden rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full object-cover"
                      />
                    </motion.div>
                  )}
                  <h2 className="font-heading text-xl font-semibold text-slate-900 transition-colors group-hover:text-[#3B82F6] dark:text-slate-50 dark:group-hover:text-[#3B82F6]">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
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
                  {post.tags?.map((t) => (
                    <Link
                      key={t.id}
                      href={`/blog?tag=${t.slug}`}
                      className="text-[#3B82F6] hover:underline"
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          {pagination.pages > 1 && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex justify-center gap-2"
            >
              <motion.button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Previous
              </motion.button>
              <span className="flex items-center px-4 text-sm text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <motion.button
                onClick={() => setPage((p) => p + 1)}
                disabled={pagination.page >= pagination.pages}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Next
              </motion.button>
            </motion.nav>
          )}
        </>
      )}
    </div>
  );
}
