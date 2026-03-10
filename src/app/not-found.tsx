'use client'
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-6xl font-bold text-slate-900 dark:text-slate-50">
        404
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Page not found
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Go home
      </Link>
    </div>
  );
}
