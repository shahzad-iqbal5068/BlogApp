"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import { addHeadingIds } from "@/lib/utils";

function isHtml(content: string) {
  return content.trim().startsWith("<");
}

export default function PostContent({ content }: { content: string }) {
  if (isHtml(content)) {
    const htmlWithIds = addHeadingIds(content);
    return (
      <div
        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:scroll-mt-24 prose-a:text-[#3B82F6] prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded dark:prose-code:bg-slate-800"
        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
      />
    );
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypePrism]}
      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-[#3B82F6] prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded dark:prose-code:bg-slate-800"
    >
      {content}
    </ReactMarkdown>
  );
}
