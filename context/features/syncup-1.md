# Feature: Dashboard Sync-Up — Fetch & Store Solved Problems

## Overview

The dashboard already has a "Sync Up" button, currently wired to dummy data. This feature replaces that with the real implementation: on click, it hits `/api/sync` (already listed in `project-overview.md`'s API Routes), which calls LeetCode's authenticated `solvedQuestionsInfo` query using the validated `LEETCODE_SESSION` stored in `LeetCodeSession` (from the Settings feature already implemented).

All currently solved problems are fetched (paginated), then stored: new problems get inserted into `Problem`, and `UserProblem` rows are created or refreshed to reflect the connection between the logged-in user and each solved problem.

This feature is response-driven, not schema-driven — only fields actually present in the `solvedQuestionsInfo` response get mapped to the data model. Fields the schema has but this particular query doesn't provide (acceptance rate, premium flag, patterns, per-submission detail) are explicitly called out as gaps, not silently skipped.

No database migration is needed for this feature — `Problem` and `UserProblem` already exist and already support every field this query can populate.

---

## Requirements

### 1. Pre-Sync Checks
- Resolve the logged-in user's `LeetCodeSession` row
- If none exists, or `isValid` is false → don't call LeetCode at all; return an error directing the user to `/settings` to connect/refresh their session
- Username isn't needed for this call — `solvedQuestionsInfo` is scoped to whoever the session cookie belongs to, not by a username parameter

### 2. Fetching — `solvedQuestionsInfo`
- Call with `filters: {}`, `pageNo: 1`, `numPerPage: 50`, session cookie attached, plus the other authenticated headers from `LEETCODE_GRAPHQL_DOCS.md`
- Read `totalNum` and `pageNum` from the first response — `pageNum` is the **total page count**, not the current page
- If `pageNum > 1`, fetch the remaining pages sequentially (page 1 → pageNum), not in parallel, per the rate-limit note in `LEETCODE_GRAPHQL_DOCS.md`
- Accumulate every page's `data` array into one full list before processing anything
- If any page request comes back unauthorized mid-pagination → stop, mark `LeetCodeSession.isValid = false`, and return a partial/failure result rather than silently continuing as if nothing happened

### 3. Response → Data Model Mapping

This is the core of the feature — only what's listed below gets written; nothing is invented to fill schema gaps.

**Per `data[i]` item → `Problem` table** (only when the problem doesn't already exist, matched by `titleSlug`):

| Response field | Maps to | Notes |
|---|---|---|
| `question.titleSlug` | `Problem.titleSlug` | Unique key used to detect existing rows |
| `question.title` | `Problem.title` | |
| `question.questionFrontendId` | `Problem.questionId` | String → Int conversion; this is the *display* number, not LeetCode's internal numeric ID (the two differ per the `question` query docs) |
| `question.difficulty` | `Problem.difficulty` | Comes back as `"Easy"/"Medium"/"Hard"` — map to the `EASY/MEDIUM/HARD` enum |
| `question.topicTags[].name` | `Problem.topics` (String[]) | These are LeetCode topics (e.g. "Array", "Hash Table") — **not** patterns |
| *(not in response)* | `Problem.acceptanceRate` | Left `null` on insert. Only available via the `question` or `problemsetQuestionListV2` queries — out of scope here, candidate for a later enrichment pass |
| *(not in response)* | `Problem.isPaidOnly` | Left at its default (`false`) on insert — same gap as above |

**Per `data[i]` item → `UserProblem` table** (for the current user + resolved `Problem.id`):

| Response field | Maps to | Notes |
|---|---|---|
| `lastAcSession.time` | `UserProblem.lastSolvedAt` | Milliseconds Unix timestamp — convert directly to `Date`. Can be `null` per docs; see Edge Cases |
| `lastAcSession.time` | `UserProblem.firstSolvedAt` | **Only set on first insert** for that (user, problem) pair — equal to `lastSolvedAt` since this query gives no earlier history. Never overwritten on later syncs |
| `totalSolves` | *(not stored)* | Present in the response but there's no column for it today; worth flagging as a possible future field (e.g. "times re-solved") rather than adding an unplanned column in this feature |

**Not touched by this feature at all:**

| Table | Why |
|---|---|
| `Pattern` / `ProblemPattern` | LeetCode's API has no concept of "patterns" (Sliding Window, Two Pointers, etc.) — those are topics (`topicTags`), already mapped above. Pattern assignment is a separate curation step, manual or future-automated, not part of sync |
| `Submission` | `solvedQuestionsInfo` returns no per-submission status/language/runtime/memory data, and none of the other documented queries do either. Populating this needs a different, not-yet-tested query — a separate future feature |

### 4. Write Strategy
- For new problems: batch-insert into `Problem` using `createMany` with `skipDuplicates: true` on `titleSlug`, consistent with the existing sync-safety convention
- After insert, resolve `titleSlug → Problem.id` for every item in the fetched data (covers both just-inserted and pre-existing problems) so `UserProblem` rows reference the correct `problemId`
- For `UserProblem`:
  - No existing row for (userId, problemId) → insert with `firstSolvedAt = lastSolvedAt = lastAcSession.time`
  - Row already exists → update `lastSolvedAt` only if the new `lastAcSession.time` is more recent than what's stored (covers a problem being re-solved later); leave `firstSolvedAt` untouched
- A sync should never delete existing rows — it's purely additive/refreshing

### 5. Post-Sync Response
- Return a summary to the client: total problems fetched, how many were newly inserted vs. already known, and a completion timestamp
- Dashboard should use this to refresh its (currently dummy) data and show a clear "Synced — X new problems added" style confirmation

### 6. Edge Cases
- `lastAcSession.time` is `null` for a given item — decide a fallback (e.g. use the sync's current timestamp) rather than leaving `firstSolvedAt`/`lastSolvedAt` null, since dashboard views likely depend on having a date
- User has 0 solved problems — `totalNum` is 0; sync should complete cleanly with an empty result, not error
- User clicks "Sync Up" again while a sync is already in progress — guard against duplicate concurrent syncs (disable the button client-side at minimum; a server-side check is worth considering too)
- Session expires partway through a multi-page pagination loop (large solve counts) — stop cleanly, keep whatever was already written, surface a clear "session expired mid-sync, please reconnect" message rather than a generic failure
- `questionFrontendId` fails to parse to a valid integer — shouldn't normally happen, but guard against it rather than letting a bad row through silently

### 7. Out of Scope (Forward-Looking)
- Backfilling `acceptanceRate` and `isPaidOnly` for synced problems — needs a separate enrichment pass using `question` or `problemsetQuestionListV2`
- Populating `Submission` — needs a different, currently undocumented/untested query
- Assigning `Pattern`s to problems — manual curation or a future automated step (e.g. mapping known topic combinations to patterns)
- True incremental optimization (e.g. skipping unchanged pages) — this feature always re-fetches the full solved list on every click