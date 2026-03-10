"use client";

import Link from "next/link";

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="absolute left-4 top-4 z-[100] -translate-y-[200%] rounded-lg bg-[#3B82F6] px-4 py-2 text-white transition-transform duration-200 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      Skip to main content
    </Link>
  );
}
