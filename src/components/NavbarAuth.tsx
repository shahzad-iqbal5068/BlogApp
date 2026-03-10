"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm text-slate-500">...</span>;
  }

  if (session) {
    const role = (session.user as { role?: string })?.role;
    return (
      <div className="flex items-center gap-6">
        {(role === "ADMIN" || role === "AUTHOR") && (
          <Link
            href="/blog/new"
            className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
          >
            New post
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
      >
        Register
      </Link>
    </div>
  );
}
