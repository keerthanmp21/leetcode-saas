# Current Feature

Dashboard Problem Details Drawer

## Status

Complete

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: shadcn/ui init, Input component, /dashboard route, dark mode by default, top bar with search, sidebar and main placeholders
- Dashboard UI Phase 2: collapsible sidebar with Dashboard/Analytics/Settings nav items, user avatar at bottom, mobile drawer, unified top bar with ⚡ Dashboard heading + subtitle + search + Sync Now button
- Prisma + Neon PostgreSQL: Prisma 7 with @prisma/adapter-neon, schema with User/Problem/UserProblem/Pattern/ProblemPattern/Submission + NextAuth v5 models, initial migration applied to Neon dev branch, prisma singleton at src/lib/prisma.ts
- Dashboard UI Phase 3: stats cards (Total/Easy/Medium/Hard), Problems by Pattern section with All/Unsolved filter, pattern rows showing 3–4 problem cards each with colored left border and "View all →" arrow, pattern detail page at /dashboard/patterns/[id], mock data expanded to 38 problems across 10+ patterns
- Dashboard Problem Details Drawer: right-side drawer triggered by problem card click (dashboard + pattern detail page), showing solved banner, difficulty, acceptance rate with progress bar, tags, description, time/space complexity, selectable solution patterns, solution code textarea, Get AI Solution / Save Solution / Cancel actions, sticky Copy Link + View on LeetCode footer; drawer is drag-resizable from the left edge (320–900px)
