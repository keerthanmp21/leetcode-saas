# Current Feature

Settings Page — LeetCode Username & Session Connect

## Status

Complete

## Goals

- Build `/settings` route with a form for `LEETCODE_USERNAME` and `LEETCODE_SESSION`
- Validate username against the public LeetCode GraphQL API (`matchedUser` query)
- Validate session against LeetCode's authenticated `solvedQuestionsInfo` query
- Persist username to `User.leetcodeUsername`; add `LeetCodeSession` table for session storage
- Show session status with distinct states: Not Connected / Validating / Connected / Expired
- Display last-validated timestamp when connected
- Never return or log the raw session token after save

## Notes

- Username field: plain text, one-time setup but still editable. Validate via public LeetCode GraphQL (`matchedUser`).
- Session field: masked/sensitive input. Validate via `solvedQuestionsInfo` with `Cookie: LEETCODE_SESSION=...` header (plus Content-Type, User-Agent, Referer, x-csrftoken per `LEETCODE_GRAPHQL_DOCS.md`).
- `LeetCodeSession` model: `id`, `userId` (unique FK), `sessionToken`, `isValid` (Boolean, default false), `lastValidatedAt` (nullable DateTime), `createdAt`, `updatedAt`. 1:1 with `User`.
- Run `prisma migrate dev` (no `db push`) to create migration.
- `sessionToken` is sensitive: no logging, no API response exposure.
- Validation reusable for later background re-validation.
- Distinguish "session rejected by LeetCode" from "LeetCode unreachable" in UI messaging.
- Do NOT wire Sync Up button — that is the next feature.
- Flag (but don't block on) whether `sessionToken` needs encryption at rest.

### Key Edge Cases
- Empty or malformed session input
- Username not found on LeetCode
- First-time connect vs. overwriting existing session (upsert, not duplicate)
- Network error vs. auth failure
- Revisiting Settings with a silently-expired session (show Expired, not stale Connected)
- Updating username only should not re-validate an already-valid session

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: shadcn/ui init, Input component, /dashboard route, dark mode by default, top bar with search, sidebar and main placeholders
- Dashboard UI Phase 2: collapsible sidebar with Dashboard/Analytics/Settings nav items, user avatar at bottom, mobile drawer, unified top bar with ⚡ Dashboard heading + subtitle + search + Sync Now button
- Prisma + Neon PostgreSQL: Prisma 7 with @prisma/adapter-neon, schema with User/Problem/UserProblem/Pattern/ProblemPattern/Submission + NextAuth v5 models, initial migration applied to Neon dev branch, prisma singleton at src/lib/prisma.ts
- Dashboard UI Phase 3: stats cards (Total/Easy/Medium/Hard), Problems by Pattern section with All/Unsolved filter, pattern rows showing 3–4 problem cards each with colored left border and "View all →" arrow, pattern detail page at /dashboard/patterns/[id], mock data expanded to 38 problems across 10+ patterns
- Dashboard Problem Details Drawer: right-side drawer triggered by problem card click (dashboard + pattern detail page), showing solved banner, difficulty, acceptance rate with progress bar, tags, description, time/space complexity, selectable solution patterns, solution code textarea, Get AI Solution / Save Solution / Cancel actions, sticky Copy Link + View on LeetCode footer; drawer is drag-resizable from the left edge (320–900px)
- Settings Page — LeetCode Username & Session Connect: `/settings` route with username form (validated via `matchedUser` GraphQL) and session form (validated via `userStatus` query with cross-account check); `LeetCodeSession` DB model + migration; silent-expiry detection on page load re-validates stored session and marks it expired if LeetCode rejects it; distinct Not Connected / Validating / Connected / Expired states; session token masked in UI, never returned or logged; `src/lib/leetcode.ts` validation functions reusable for background sync
