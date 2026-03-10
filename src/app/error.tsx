"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-6xl font-bold text-slate-900 dark:text-slate-50">
        500
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Something went wrong
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        We&apos;re sorry. An unexpected error occurred.
      </p>
      <div className="mt-8 flex gap-4">
        <button onClick={reset} className={buttonVariants()}>
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}
