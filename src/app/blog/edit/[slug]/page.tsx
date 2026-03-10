"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import CoverImageUpload from "@/components/CoverImageUpload";
import PostVersionHistory from "@/components/PostVersionHistory";
import { PostSkeleton } from "@/components/Skeleton";
import { AISEOButton } from "@/components/AIAssistBar";

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}`, { credentials: "include" })
      .then((r) => r.json())
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setCoverImage(post.coverImage || null);
        setStatus(post.status);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PATCH",
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
      setError(data.error || "Failed to update");
      return;
    }
    window.location.href = `/blog/${slug}`;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/blog/${slug}`}
        className="mb-8 inline-block text-sm text-[#3B82F6] hover:underline"
      >
        ← Back to post
      </Link>
      <h1 className="font-heading mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Edit post
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
              Excerpt (optional)
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
        <PostVersionHistory slug={slug} />
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-lg bg-[#3B82F6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2563eb]"
          >
            Save changes
          </button>
          <Link
            href={`/blog/${slug}`}
            className="rounded-lg border border-slate-200 px-6 py-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
