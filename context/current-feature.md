# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

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
- Typed External API Responses: replaced implicit `any` at every `res.json()` call site with explicit interfaces — `GraphQLError`/`SolvedQuestionsGraphQLResponse`/`MatchedUserGraphQLResponse`/`UserStatusGraphQLResponse` in `src/lib/leetcode.ts`, `SyncSuccessResponse`/`SyncErrorResponse` in new `src/types/sync.ts` consumed by `sync-button.tsx`; typing-only pass, no behavior change; added unit test coverage for `validateLeetCodeUsername`/`validateLeetCodeSession` (previously untested)
