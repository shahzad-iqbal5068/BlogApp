"use client";

import { useState } from "react";

export default function AISummaryButton({ content }: { content: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-8 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Summarizing...
          </>
        ) : (
          <>
            <span>📝</span>
            AI Summary
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      {summary && (
        <div className="mt-4 rounded-lg bg-white p-4 dark:bg-slate-900">
          <h4 className="font-heading mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Summary
          </h4>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
