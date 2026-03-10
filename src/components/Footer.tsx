import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="mx-auto max-w-4xl px-8 py-16">
        <div className="mb-12 flex justify-center">
          <NewsletterSignup />
        </div>
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/"
              className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            >
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} BlogApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
