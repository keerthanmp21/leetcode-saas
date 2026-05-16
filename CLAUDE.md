# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# leetcode-saas
A SaaS platform for LeetCode users to track their progress, analyze their performance, and get insights into their coding journey.

@AGENTS.md

## Context Files

Read these for full project context:

- @context/project-overview.md: Features, data models, tech stack, UI/UX
- @context/coding-standards.md: Code conventions and patterns
- @context/ai-interaction.md : Workflow and communication guidelines
- @context/current-feature.md: What we are currently working on

## Tech Stack

- Next.js 16 (App Router, Server Components)
- TypeScript (strict)
- Prisma + Neon PostgreSQL
- NextAuth v5 (Email + GitHub)
- Tailwind CSS v4 + shadcn/ui
- Cloudflare R2 (file storage)
- OpenAI gpt-5-nano
- Stripe (payments)

## Commands

```bash
npm run dev       # Start dev server on port 8000 (local only)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

Next.js 16 App Router project with TypeScript and Tailwind CSS v4.

- `src/app/layout.tsx` — root layout; loads Geist Sans + Geist Mono via `next/font/google`, applies them as CSS variables
- `src/app/page.tsx` — home route (`/`)
- `src/app/globals.css` — global styles; contains only the Tailwind import
- Path alias `@/*` maps to `src/*`
