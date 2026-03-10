"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import CoverImageUpload from "@/components/CoverImageUpload";
import { AISEOButton } from "@/components/AIAssistBar";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        status,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create");
      return;
    }
    const post = await res.json();
    router.push(`/blog/${post.slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/blog"
        className="mb-8 inline-block text-sm text-[#3B82F6] hover:underline"
      >
        ← Back to Blog
      </Link>
      <h1 className="font-heading mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        New post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            required
          />
        </div>
        <CoverImageUpload value={coverImage} onChange={setCoverImage} />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Excerpt (optional, used as meta description)
            </label>
            <AISEOButton
              content={content}
              currentTitle={title}
              onApply={(t, d) => {
                setTitle(t);
                setExcerpt(d);
              }}
            />
          </div>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Content
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your post content..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-lg bg-[#3B82F6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2563eb]"
          >
            {status === "DRAFT" ? "Save draft" : "Publish"}
          </button>
          <Link
            href="/blog"
            className="rounded-lg border border-slate-200 px-6 py-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
