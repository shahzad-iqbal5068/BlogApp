import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_POSTS = [
  {
    title: "Getting Started with Next.js 16",
    slug: "getting-started-with-nextjs-16",
    excerpt:
      "Learn the basics of Next.js 16 App Router, server components, and the new features that make building React apps easier than ever.",
    content: `## Introduction

Next.js 16 brings exciting new features to the React ecosystem. In this post, we'll explore the App Router, Server Components, and how to get started.

## Key Features

- **App Router**: File-based routing with layouts
- **Server Components**: Reduce client-side JavaScript
- **Turbopack**: Faster development builds

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

That's it! You're ready to build.`,
    category: "Technology",
    tags: ["nextjs", "react"],
  },
  {
    title: "TypeScript Best Practices for React",
    slug: "typescript-best-practices-react",
    excerpt:
      "Improve your React codebase with these TypeScript patterns and practices.",
    content: `## Why TypeScript?

TypeScript adds type safety to your React applications, catching bugs before they reach production.

## Key Patterns

1. **Use interfaces for props**
2. **Leverage generics for reusable components**
3. **Avoid \`any\` - use \`unknown\` when needed**

## Example

\`\`\`tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}
\`\`\``,
    category: "Tutorials",
    tags: ["typescript", "react"],
  },
  {
    title: "Building a Blog with AI Features",
    slug: "building-blog-with-ai",
    excerpt:
      "How we built an AI-powered blog with automatic summaries, tag suggestions, and SEO optimization.",
    content: `## The Vision

We wanted to create a blog that leverages AI to help authors write better content and readers understand it faster.

## AI Features We Added

- **Auto-summary**: Generate post summaries
- **Tag suggestions**: AI recommends relevant tags
- **SEO optimization**: Better titles and descriptions
- **Explain simply**: Break down complex topics

## Architecture

We use the OpenAI API with Next.js API routes. The key is caching and rate limiting.`,
    category: "Technology",
    tags: ["nextjs", "react", "typescript"],
  },
  {
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    excerpt:
      "Trends and predictions for the next decade of web development.",
    content: `## What's Coming

The web is evolving rapidly. Here are the trends we're watching:

1. **Edge computing** - Run code closer to users
2. **AI integration** - Smarter, more personalized experiences
3. **WebAssembly** - Performance-critical code in the browser
4. **Progressive Web Apps** - Installable, offline-capable apps

## Our Take

The best approach is to stay curious and keep learning.`,
    category: "News",
    tags: ["react"],
  },
  {
    title: "Accessibility Matters",
    slug: "accessibility-matters",
    excerpt:
      "Why accessibility isn't optional and how to build inclusive web apps.",
    content: `## The Case for A11y

Over 1 billion people have disabilities. Accessible design benefits everyone.

## Quick Wins

- **Semantic HTML**: Use the right elements
- **ARIA labels**: When semantics aren't enough
- **Keyboard navigation**: Don't rely on mouse only
- **Color contrast**: Ensure readability

## Testing

Use screen readers and keyboard-only navigation to test your app.`,
    category: "Tutorials",
    tags: ["react", "nextjs"],
  },
];

async function main() {
  const hashed = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@blogapp.com" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@blogapp.com",
      name: "Admin",
      password: hashed,
      role: "ADMIN",
    },
  });
  console.log("Admin user:", admin.email);

  const categories = [
    { name: "Technology", slug: "technology" },
    { name: "Tutorials", slug: "tutorials" },
    { name: "News", slug: "news" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log("Categories seeded");

  const tags = [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
  ];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }
  console.log("Tags seeded");

  const techCat = await prisma.category.findUnique({
    where: { slug: "technology" },
  });
  const tutorialsCat = await prisma.category.findUnique({
    where: { slug: "tutorials" },
  });
  const newsCat = await prisma.category.findUnique({
    where: { slug: "news" },
  });

  for (const post of SAMPLE_POSTS) {
    const category =
      post.category === "Technology"
        ? techCat
        : post.category === "Tutorials"
          ? tutorialsCat
          : newsCat;

    const tagSlugs = post.tags;
    const tagRecords = await prisma.tag.findMany({
      where: { slug: { in: tagSlugs } },
    });

    const existing = await prisma.post.findUnique({
      where: { slug: post.slug },
    });
    if (existing) continue;

    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        publishedAt: new Date(),
        readingTime: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
        authorId: admin.id,
        categoryId: category?.id,
        tags: {
          connect: tagRecords.map((t) => ({ id: t.id })),
        },
      },
    });
  }
  console.log("Sample posts seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
