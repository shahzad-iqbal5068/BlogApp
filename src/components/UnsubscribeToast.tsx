"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribeToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsub = searchParams.get("unsubscribed");
    const error = searchParams.get("error");
    if (unsub === "1") {
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
    if (error) {
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  }, [searchParams]);

  if (!show) return null;

  const unsub = searchParams.get("unsubscribed");
  const error = searchParams.get("error");

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {unsub === "1" ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          You have been unsubscribed from the newsletter.
        </p>
      ) : error ? (
        <p className="text-sm text-red-500">
          {error === "invalid_token" ? "Invalid unsubscribe link." : "Something went wrong."}
        </p>
      ) : null}
    </div>
  );
}
