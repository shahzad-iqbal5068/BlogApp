import Link from "next/link";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172A]/95"
    >
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-slate-900 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-50 dark:hover:text-[#3B82F6]"
          aria-label="BlogApp home"
        >
          BlogApp
        </Link>
        <div className="flex items-center gap-10" role="menubar">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            role="menuitem"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            role="menuitem"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#3B82F6] dark:text-slate-400 dark:hover:text-[#3B82F6]"
            role="menuitem"
          >
            About
          </Link>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  );
}
