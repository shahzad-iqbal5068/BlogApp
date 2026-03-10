"use client";

import { useState } from "react";

export function AITagsButton({
  content,
  title,
  onApply,
}: {
  content: string;
  title: string;
  onApply: (tags: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    setSuggested([]);
    try {
      const res = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuggested(data.tags || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border border-[#3B82F6] px-3 py-1.5 text-sm font-medium text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/10 disabled:opacity-50"
      >
        {loading ? "..." : "✨ AI suggest tags"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {suggested.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggested.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onApply([...suggested])}
              className="rounded bg-slate-200 px-2 py-1 text-xs dark:bg-slate-700"
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onApply(suggested)}
            className="text-xs text-[#3B82F6] hover:underline"
          >
            Apply all
          </button>
        </div>
      )}
    </div>
  );
}

export function AISEOButton({
  content,
  currentTitle,
  onApply,
}: {
  content: string;
  currentTitle: string;
  onApply: (title: string, description: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, currentTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onApply(data.title || "", data.description || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border border-[#3B82F6] px-3 py-1.5 text-sm font-medium text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/10 disabled:opacity-50"
      >
        {loading ? "..." : "✨ AI SEO title & description"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
