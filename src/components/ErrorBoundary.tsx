"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center px-6 py-12 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Something went wrong.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-4" })}>
            Go home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
