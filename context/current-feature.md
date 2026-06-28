# Current Feature

Dashboard Sync-Up — Fetch & Store Solved Problems

## Status

Complete

## Goals

- Wire the "Sync Up" button to `POST /api/sync` which fetches all solved problems from LeetCode using the stored `LEETCODE_SESSION`
- Pre-check that a valid session exists; if not, return an error directing the user to `/settings`
- Paginate through `solvedQuestionsInfo` (page 1 → totalPages) sequentially, accumulating all results before writing
- Batch-insert new problems into `Problem` (upsert on `titleSlug`) with only fields the response provides
- Create or refresh `UserProblem` rows: insert with `firstSolvedAt = lastSolvedAt` on first sync; update `lastSolvedAt` only if newer on subsequent syncs
- Return a sync summary (total fetched, new vs. known, timestamp); display "Synced — X new problems added" on the dashboard
- Handle mid-pagination session expiry: stop cleanly, mark session invalid, surface a clear error

## Notes

- No migration needed — `Problem` and `UserProblem` already support all fields this query populates
- Fetch uses `solvedQuestionsInfo` with `filters: {}`, per `LEETCODE_GRAPHQL_DOCS.md` authenticated headers
- `pageNum` in the response = total page count (not current page); loop page 1 → pageNum sequentially (not parallel, per rate-limit rules)
- `questionFrontendId` → `Problem.questionId` as Int; guard against non-integer values
- `question.topicTags[].name` → `Problem.topics` (String[]); these are LeetCode topics, NOT patterns
- `Problem.acceptanceRate` and `Problem.isPaidOnly` are left null/default — not in this response
- `lastAcSession.time` is ms Unix timestamp → convert to `Date`; if null, fall back to current sync timestamp
- `totalSolves` is present in response but has no column — flag as future field, do not add column
- `Pattern`/`ProblemPattern` and `Submission` tables are not touched — out of scope
- Guard against concurrent syncs: disable button client-side while in-flight; consider server-side lock too
- Never delete existing `UserProblem` rows — sync is purely additive/refreshing

### Key Edge Cases
- No valid session → return error, direct to `/settings`
- 0 solved problems → complete cleanly with empty result
- Mid-pagination unauthorized → stop, mark `LeetCodeSession.isValid = false`, return partial failure message
- `lastAcSession.time` is null → use sync timestamp as fallback for `firstSolvedAt`/`lastSolvedAt`
- `questionFrontendId` not parseable as Int → skip row with a warning, don't crash
- Duplicate sync in-flight → button disabled client-side; server should handle gracefully

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
