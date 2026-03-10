# BlogApp Implementation Plan

Full roadmap for building a market-standard blog with AI features.

---

## Phase 1: Foundation ✅

### A) Database Schema + Prisma
- [x] Prisma schema with User, Post, Category, Tag, Account, Session
- [x] Roles: ADMIN, AUTHOR, READER
- [x] Post status: DRAFT, PUBLISHED
- [ ] Run: `npx prisma generate` and `npx prisma db push`
- [ ] Copy `.env.example` to `.env.local` and set `DATABASE_URL`

### B) Authentication
- [x] NextAuth.js v5 with JWT
- [x] Credentials provider (email + password)
- [x] Google OAuth (add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [x] GitHub OAuth (add GITHUB_ID, GITHUB_SECRET)
- [x] Role-based session (id, role in JWT)
- [x] Register API (`/api/auth/register`)
- [x] Login page (`/login`)
- [x] Register page (`/register`)
- [x] Middleware for protected routes (`/dashboard`, `/blog/new`, `/blog/edit`)
- [x] Admin-only routes (`/admin`)

---

## Phase 2: Blog CRUD ✅

### C) Blog Management
- [x] POST `/api/posts` - Create post (Author/Admin)
- [x] GET `/api/posts` - List published (with pagination, filters)
- [x] GET `/api/posts/[slug]` - Get single post (drafts for author)
- [x] PATCH `/api/posts/[slug]` - Update post
- [x] DELETE `/api/posts/[slug]` - Delete post
- [x] Blog list page (`/blog`)
- [x] Blog post page (`/blog/[slug]`)
- [x] New post page (`/blog/new`)
- [x] Edit post page (`/blog/edit/[slug]`)
- [x] Markdown content support
- [x] Rich text editor (Tiptap)
- [x] Cover image upload (Uploadthing)
- [x] Categories & tags (seed + API)

---

## Phase 3: Reading Experience ✅

- [x] SEO-friendly URLs (`/blog/[slug]`)
- [x] Markdown + HTML rendering
- [x] Code syntax highlighting (rehype-prism-plus)
- [x] Table of contents (auto from headings)
- [x] Reading time indicator
- [x] Responsive layout

---

## Phase 4: Search & Filter ✅

- [x] Search by title/content (`?q=`)
- [x] Filter by category (`?category=`)
- [x] Filter by tag (`?tag=`)
- [x] Filter by date (`?from=`, `?to=`)
- [x] Pagination UI

---

## Phase 5: AI Features ✅

- [x] AI blog summary (`/api/ai/summary`)
- [x] AI tag suggestions (`/api/ai/tags`)
- [x] AI SEO title & description (`/api/ai/seo`)
- [x] "Explain in simple words" (`/api/ai/explain`)

---

## Phase 6: Version History & Newsletter ✅

### Version History
- [x] PostVersion model (snapshot on each edit)
- [x] GET `/api/posts/[slug]/versions` - List versions
- [x] POST `/api/posts/[slug]/versions/[id]` - Restore version
- [x] Version history panel in edit page

### Newsletter
- [x] NewsletterSubscriber model
- [x] POST `/api/newsletter/subscribe` - Email subscription
- [x] GET `/api/newsletter/unsubscribe?token=` - Unsubscribe (redirect)
- [x] POST `/api/newsletter/unsubscribe` - Unsubscribe (API)
- [x] GET `/api/newsletter/digest` - Weekly digest (cron, Resend)
- [x] Newsletter signup in footer
- [x] Unsubscribe toast on success

---

## Setup Commands

```bash
# 1. Install dependencies
npm install prisma @prisma/client next-auth@beta bcryptjs @auth/prisma-adapter
npm install -D @types/bcryptjs

# 2. Environment
cp .env.example .env.local
# Edit .env.local: DATABASE_URL, AUTH_SECRET

# 3. Database
npx prisma generate
npx prisma db push

# 4. Seed (creates admin@blogapp.com / admin123, categories, tags)
npx prisma db seed

# 5. Run
npm run dev
```

---

## Role Permissions

| Action        | Reader | Author | Admin |
|---------------|--------|--------|-------|
| Read posts    | ✅     | ✅     | ✅    |
| Create post   | ❌     | ✅     | ✅    |
| Edit own post | ❌     | ✅     | ✅    |
| Edit any post | ❌     | ❌     | ✅    |
| Delete own    | ❌     | ✅     | ✅    |
| Delete any    | ❌     | ❌     | ✅    |
| Admin panel   | ❌     | ❌     | ✅    |
