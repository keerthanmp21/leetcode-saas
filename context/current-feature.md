# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Complete

## Goals

- Install and configure Prisma 7 ORM
- Connect to Neon PostgreSQL (serverless) via `DATABASE_URL`
- Define initial schema based on data models in project-overview.md:
  - `User` — app users with LeetCode username
  - `Problem` — LeetCode problems with metadata
  - `UserProblem` — join table tracking which users solved which problems
  - `Pattern` — DSA patterns (e.g. Sliding Window, DP)
  - `ProblemPattern` — join table linking problems to patterns
  - `Submission` — submission metadata per user/problem
  - `Account`, `Session`, `VerificationToken` — NextAuth v5 models
- Add appropriate indexes and cascade deletes
- Create initial migration (never `db push`)
- Confirm dev branch (`DATABASE_URL`) is the migration target; production branch is separate

## Notes

- Use Prisma 7 — has breaking changes from Prisma 5/6. Read the upgrade guide before writing any code.
- Always use `prisma migrate dev` to create migrations. Never use `prisma db push`.
- `DATABASE_URL` points to the Neon **development** branch. Production branch is separate.
- NextAuth models must be included for auth to work in a later feature.
- Indexes: `Problem.difficulty`, `Problem.isPaidOnly`; cascade deletes on user-owned records.

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: shadcn/ui init, Input component, /dashboard route, dark mode by default, top bar with search, sidebar and main placeholders
- Dashboard UI Phase 2: collapsible sidebar with Dashboard/Analytics/Settings nav items, user avatar at bottom, mobile drawer, unified top bar with ⚡ Dashboard heading + subtitle + search + Sync Now button
- Prisma + Neon PostgreSQL: Prisma 7 with @prisma/adapter-neon, schema with User/Problem/UserProblem/Pattern/ProblemPattern/Submission + NextAuth v5 models, initial migration applied to Neon dev branch, prisma singleton at src/lib/prisma.ts