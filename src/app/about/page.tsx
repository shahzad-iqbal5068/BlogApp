import Link from "next/link";
import { getPostCount, getCategoryCount } from "@/lib/posts";

export const metadata = {
  title: "About | BlogApp",
  description: "Learn about BlogApp - our mission, team, and what we write about.",
};

export default async function AboutPage() {
  const [postCount, categoryCount] = await Promise.all([
    getPostCount(),
    getCategoryCount(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <h1 className="font-heading mb-8 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          About BlogApp
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            BlogApp is a modern blog platform built with Next.js, designed to
            help authors share ideas and readers discover great content. We
            focus on technology, tutorials, and practical guides for developers
            and creators.
          </p>

          <h2 className="font-heading mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            What we write about
          </h2>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Web development with React, Next.js, and TypeScript</li>
            <li>Best practices and patterns for modern apps</li>
            <li>AI-powered features for writing and content creation</li>
            <li>Tutorials and how-to guides</li>
          </ul>

          <h2 className="font-heading mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            By the numbers
          </h2>
          <div className="mt-6 flex flex-wrap gap-8">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/30">
              <p className="text-3xl font-bold text-[#3B82F6]">{postCount}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Published posts
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/30">
              <p className="text-3xl font-bold text-[#3B82F6]">{categoryCount}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Categories
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#3B82F6] px-5 font-medium text-white transition-colors hover:bg-[#2563eb]"
            >
              Browse blog
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 px-5 font-medium text-slate-700 transition-colors hover:border-[#3B82F6] hover:text-[#3B82F6] dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#3B82F6] dark:hover:text-[#3B82F6]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
