import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export type TocItem = { id: string; text: string; level: number };

export function addHeadingIds(html: string): string {
  let idx = 0;
  return html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, level, attrs, text) => {
      const plainText = text.replace(/<[^>]+>/g, "").trim();
      const id = slugify(plainText) || `h-${idx++}`;
      if (/id\s*=/.test(attrs)) return `<h${level}${attrs}>${text}</h${level}>`;
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

export function extractHeadings(content: string): TocItem[] {
  const items: TocItem[] = [];
  const isHtml = content.trim().startsWith("<");

  if (isHtml) {
    const hRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h\1>/gi;
    let m;
    while ((m = hRegex.exec(content)) !== null) {
      items.push({
        id: m[2],
        text: m[3].replace(/<[^>]+>/g, "").trim(),
        level: parseInt(m[1], 10),
      });
    }
    if (items.length > 0) return items;
    const hRegex2 = /<h([1-6])[^>]*>([^<]*)<\/h\1>/gi;
    let idx = 0;
    while ((m = hRegex2.exec(content)) !== null) {
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      const id = slugify(text) || `h-${idx++}`;
      items.push({ id, text, level: parseInt(m[1], 10) });
    }
  } else {
    const lines = content.split("\n");
    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugify(text);
        if (id) items.push({ id, text, level });
      }
    }
  }
  return items;
}
