# Feature: Settings Page — LeetCode Username & Session Connect

## Overview

Build the Settings page (`/settings`), which doesn't exist yet. It has two related responsibilities:

1. Collect the user's `LEETCODE_USERNAME` — a one-time setup value, used for public LeetCode GraphQL queries (profile, stats, recent submissions, etc.)
2. Collect the user's `LEETCODE_SESSION` cookie value — the credential required for the one authenticated LeetCode GraphQL call we use (`solvedQuestionsInfo`), which expires periodically and may need re-entry

Per `LEETCODE_GRAPHQL_DOCS.md`, `solvedQuestionsInfo` is the only authenticated query available. Everything else (recent submissions, profile, problem set, etc.) works without a session, using just the username. That means the two values have different lifecycles: username is set once and rarely changes; session is short-lived (~2 weeks) and will need refreshing, so the page should reflect its current validity rather than just whether it was ever entered.

This feature does **not** build the actual sync logic. The dashboard's existing "Sync Up" button (currently wired to dummy data) is the future consumer of both stored values — that wiring is a separate, later feature. This feature only covers: settings UI, input for both values, validation against LeetCode, and storage.

---

## Requirements

### 1. Settings Page UI
- Route: `/settings`
- A form field for `LEETCODE_USERNAME` — plain text input, one-time setup (still editable later if the user needs to correct a typo, but not expected to change routinely)
- A form field for `LEETCODE_SESSION` — treat it as a sensitive credential in the UI (masked input, no echoing it back after save)
- A save/connect action that triggers validation for whichever value(s) were submitted/changed
- A status indicator for the session specifically, with distinct states: **Not Connected**, **Validating…**, **Connected**, **Expired / Invalid**
- When connected, show the last-validated timestamp for the session
- Short helper text explaining that the session expires periodically (~2 weeks) and will need to be re-entered when that happens; username does not expire

### 2. LeetCode Username — Storage (No New Table Needed)
- The `User` model already has a `leetcodeUsername` field per `project-overview.md` — no schema change required for this part
- On save, persist the submitted username directly to `User.leetcodeUsername`
- Optional but recommended: validate the username actually exists on LeetCode before saving, via the public `matchedUser(username)` query (no session needed for this check) — catches typos immediately instead of failing silently later during sync
- If validation is included: show a clear "username not found on LeetCode" message on failure, distinct from session-related errors

### 3. LeetCode Session — Validation Flow
- On submit, call the LeetCode GraphQL endpoint using the `solvedQuestionsInfo` query with a minimal page size, attaching the submitted session as the `Cookie: LEETCODE_SESSION=...` header along with the other required headers documented in `LEETCODE_GRAPHQL_DOCS.md` (Content-Type, User-Agent, Referer; `x-csrftoken` per the auth header notes — confirm during implementation whether LeetCode actually rejects the request without it, since the docs list it as required for authenticated calls but our own earlier testing should be the source of truth)
- A successful response confirms the session is valid → persist it and mark status Connected, with a fresh validated timestamp
- A failed/unauthorized response → do not persist a broken session; show the user a clear "session invalid or expired" message
- Distinguish, if possible, between "LeetCode rejected the session" and "request couldn't reach LeetCode" (network/outage) — these should not produce the same user-facing message
- This validation call should be reusable later for periodic/background re-validation, not a one-off inline check

### 4. Data Storage — New Table for Session Only (Decision Finalized)
Username has an existing home (`User.leetcodeUsername`) — see Requirement 2. The session value does not, and needs one.

Add a new `LeetCodeSession` table, 1:1 with `User`, rather than bolting fields onto `User` directly — it's credential data with its own lifecycle (added → validated → expires → re-validated), so isolating it keeps `User` clean and makes later field-level encryption easier.

This model has already been added to `project-overview.md`'s Data Model section — implement it exactly as defined there. Implementation steps:
- Add the `LeetCodeSession` model to `schema.prisma`, matching `project-overview.md`: `id`, `userId` (unique, FK to User), `sessionToken`, `isValid` (Boolean, default false), `lastValidatedAt` (nullable DateTime), `createdAt`, `updatedAt`
- Add the corresponding `leetcodeSession` relation field on the `User` model (also already shown in `project-overview.md`)
- Generate and run a Prisma migration for this change via `prisma migrate dev` — migrations only, no `db push`, per project conventions; this will create a new entry under the existing `prisma/migrations` folder, consistent with how prior schema changes were tracked
- `sessionToken` is sensitive: never include it in any API response body, never log it

### 5. Security Considerations
- Never log the raw session value
- Never return the raw session value back to the client in any API response after it's saved — only return status/validity/timestamp
- Flag (don't silently skip) the question of whether the stored value needs encryption at rest now or can be deferred to a later hardening pass
- Username is not sensitive in the same way and can be echoed back/displayed normally

### 6. Edge Cases
- Empty or obviously malformed session input submitted
- Username left blank, or username that doesn't exist on LeetCode (if validation is implemented)
- First-time connect vs. updating/replacing an existing session — should overwrite the existing record, not create a duplicate
- Validation request fails due to LeetCode being unreachable, as distinct from the session itself being invalid
- User revisits Settings while their stored session has silently expired (next sync attempt failed) — status should reflect Expired, not still show stale "Connected"
- User updates username only, leaving an already-valid session untouched — shouldn't force re-validation of the session in that case

### 7. Out of Scope (Forward-Looking Only)
- Wiring the dashboard's "Sync Up" button to actually use the stored username and session — that's the next feature, dependent on this one
- Any UI/logic for what happens during the real sync (fetching solved problems, writing to `Problem`/`UserProblem`) — not part of this feature