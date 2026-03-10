# BlogApp

A modern blog platform built with Next.js 16, featuring authentication, rich content editing, and AI-powered features.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** Auth.js (NextAuth v5) with JWT, Credentials, Google & GitHub OAuth
- **Database:** SQLite + Prisma
- **Styling:** Tailwind CSS v4
- **Editor:** Tiptap (rich text)
- **Images:** Uploadthing
- **AI:** OpenAI API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Create .env.local (copy from below)
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Database (SQLite for dev)
DATABASE_URL="file:./dev.db"

# Auth (required)
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret"  # Generate: openssl rand -base64 32

# OAuth (optional)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_ID=
# GITHUB_SECRET=

# Optional services
# UPLOADTHING_TOKEN=
# OPENAI_API_KEY=
# RESEND_API_KEY=
# CRON_SECRET=
```

### Database Setup

```bash
# Create tables
pnpm prisma db push

# Seed with admin user and sample posts
pnpm prisma db seed
```

**Seed credentials:**
- Email: `admin@blogapp.com`
- Password: `admin123`

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm prisma studio` | Open database GUI |
| `pnpm db:push` | Sync schema to database |
| `pnpm db:seed` | Seed database |

## Features

- **Public:** Home, blog list, post detail, about
- **Auth:** Register, login (email/password, Google, GitHub)
- **Roles:** READER, AUTHOR, ADMIN
- **Posts:** Create, edit, publish, drafts, categories, tags
- **Rich editor:** Tiptap with markdown support
- **Images:** Cover images via Uploadthing
- **Newsletter:** Resend integration
- **PWA:** Installable, offline support

## Project Structure

```
src/
├── app/           # App Router pages & API routes
├── components/    # React components
├── lib/           # Prisma, utils, posts helpers
├── auth.ts        # Auth.js config
└── middleware.ts  # Route protection
```

## License

MIT
