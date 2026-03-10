import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-[#3B82F6] prose-pre:bg-slate-900 prose-pre:text-slate-100"
    >
      {content}
    </ReactMarkdown>
  );
}
