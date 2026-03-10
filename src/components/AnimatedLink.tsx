"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimatedLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      <motion.span
        className="inline-block"
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
