# Current Feature: Typed External API Responses

## Status

In Progress

## Goals

- Enforce the existing `coding-standards.md` rule ("No `any` types", "Define interfaces for all props, API responses, and data models") at every `res.json()` call site that currently consumes an implicit `any`
- Define explicit interfaces for each distinct response shape and cast `res.json()` to it, instead of letting fields be read off an untyped value
- No behavior change — typing-only pass; error handling and control flow stay identical

## Scope

See `context/features/typed-external-responses.md` for full details. Summary of call sites:

- `src/lib/leetcode.ts:74` — `fetchSolvedPage`'s `solvedQuestionsInfo` response
- `src/lib/leetcode.ts:138` — `validateLeetCodeUsername`'s `matchedUser` response
- `src/lib/leetcode.ts:189` — `validateLeetCodeSession`'s `userStatus` response
- `src/components/dashboard/sync-button.tsx:23` — `POST /api/sync` response (success + error shape)

## Notes

- Colocate each type with the file that owns the fetch (matches existing `SolvedQuestionItem` pattern in `leetcode.ts`); only export if another file needs it
- Replace the duplicated inline `{ message?: string }` GraphQL error shape (`leetcode.ts:78`) with one shared type
- `src/generated/prisma/**` is out of scope — auto-generated, not hand-written
- A type cast is compile-time only; it does not add runtime validation (zod etc. is explicitly out of scope for this pass)

### Key Edge Cases
- Existing inline anonymous types should be replaced by the shared named type, not left duplicated alongside it
- Casting doesn't protect against LeetCode changing its response schema at runtime — flagged as a known limitation, not fixed here

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: shadcn/ui init, Input component, /dashboard route, dark mode by default, top bar with search, sidebar and main placeholders
- Dashboard UI Phase 2: collapsible sidebar with Dashboard/Analytics/Settings nav items, user avatar at bottom, mobile drawer, unified top bar with ⚡ Dashboard heading + subtitle + search + Sync Now button
- Prisma + Neon PostgreSQL: Prisma 7 with @prisma/adapter-neon, schema with User/Problem/UserProblem/Pattern/ProblemPattern/Submission + NextAuth v5 models, initial migration applied to Neon dev branch, prisma singleton at src/lib/prisma.ts
- Dashboard UI Phase 3: stats cards (Total/Easy/Medium/Hard), Problems by Pattern section with All/Unsolved filter, pattern rows showing 3–4 problem cards each with colored left border and "View all →" arrow, pattern detail page at /dashboard/patterns/[id], mock data expanded to 38 problems across 10+ patterns
- Dashboard Problem Details Drawer: right-side drawer triggered by problem card click (dashboard + pattern detail page), showing solved banner, difficulty, acceptance rate with progress bar, tags, description, time/space complexity, selectable solution patterns, solution code textarea, Get AI Solution / Save Solution / Cancel actions, sticky Copy Link + View on LeetCode footer; drawer is drag-resizable from the left edge (320–900px)
- Settings Page — LeetCode Username & Session Connect: `/settings` route with username form (validated via `matchedUser` GraphQL) and session form (validated via `userStatus` query with cross-account check); `LeetCodeSession` DB model + migration; silent-expiry detection on page load re-validates stored session and marks it expired if LeetCode rejects it; distinct Not Connected / Validating / Connected / Expired states; session token masked in UI, never returned or logged; `src/lib/leetcode.ts` validation functions reusable for background sync
- Dashboard Sync-Up — Fetch & Store Solved Problems: `POST /api/sync` paginates `solvedQuestionsInfo` sequentially, upserts `Problem` rows (skipDuplicates on titleSlug), creates/refreshes `UserProblem` with firstSolvedAt/lastSolvedAt; `SyncButton` client component with idle/syncing/done/error states and "Go to Settings" link on session errors; `fetchAllSolvedProblems` + `mapDifficulty` added to `src/lib/leetcode.ts` with full unit test coverage (11 tests via Vitest)
