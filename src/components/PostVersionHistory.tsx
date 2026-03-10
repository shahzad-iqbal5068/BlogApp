"use client";

import { useState, useEffect } from "react";

type Version = {
  id: string;
  version: number;
  title: string;
  createdAt: string;
};

export default function PostVersionHistory({ slug }: { slug: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}/versions`, { credentials: "include" })
      .then((r) => r.json())
      .then(setVersions)
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleRestore(versionId: string) {
    setRestoring(versionId);
    try {
      const res = await fetch(`/api/posts/${slug}/versions/${versionId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) window.location.reload();
    } finally {
      setRestoring(null);
    }
  }

  if (loading || versions.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setExpanded(expanded ? null : "open")}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Version history ({versions.length})
        <span className="text-slate-400">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <ul className="space-y-2 text-sm">
            {versions.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-4 rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/50"
              >
                <div>
                  <span className="font-medium">v{v.version}</span>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">
                    {v.title.slice(0, 40)}
                    {v.title.length > 40 ? "…" : ""}
                  </span>
                  <span className="ml-2 text-xs text-slate-500">
                    {new Date(v.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring !== null}
                  className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  {restoring === v.id ? "..." : "Restore"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
