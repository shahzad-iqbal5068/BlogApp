"use client";

import type { TocItem } from "@/lib/utils";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <h3 className="font-heading mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
        On this page
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-slate-600 transition-colors hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
