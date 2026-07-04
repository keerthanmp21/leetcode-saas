# Feature: Typed External API Responses

## Overview

`coding-standards.md` already requires "No `any` types" and "Define interfaces for all props, API responses, and data models." In practice this rule is being violated wherever a raw `fetch(...).json()` result is consumed directly: `res.json()` returns `Promise<any>`, so every field read off it (`body.data.solvedQuestionsInfo`, `data.error`, etc.) is untyped even though the surrounding function signatures claim a specific return shape.

This feature closes that gap: every external/internal JSON response the codebase parses gets an explicit interface, and the `res.json()` call site is annotated with it, so a shape mismatch is caught by `tsc` instead of surfacing as a runtime `undefined`.

## Scope (current violations)

| File | Call site | Response | Notes |
|---|---|---|---|
| `src/lib/leetcode.ts:74` | `fetchSolvedPage` | `solvedQuestionsInfo` GraphQL response | `info.totalNum` / `info.pageNum` / `info.data` currently untyped |
| `src/lib/leetcode.ts:138` | `validateLeetCodeUsername` | `matchedUser` GraphQL response | |
| `src/lib/leetcode.ts:189` | `validateLeetCodeSession` | `userStatus` GraphQL response | |
| `src/components/dashboard/sync-button.tsx:23` | `handleSync` | `POST /api/sync` JSON body | Success (`totalFetched`, `newProblems`) and error (`error`, `settingsRequired`) shapes both need covering |

Auto-generated files under `src/generated/prisma/**` are out of scope — they're Prisma output, not hand-written code, and aren't covered by `coding-standards.md`.

## Requirements

- Define one interface/type per distinct response shape, colocated in the file that owns the fetch (matches the existing pattern of `SolvedQuestionItem` living in `leetcode.ts`); only export a type if another file actually needs it
- Cast the `res.json()` result to that type at the call site (e.g. `const body = (await res.json()) as SolvedQuestionsGraphQLResponse`) rather than leaving it as inferred `any`
- GraphQL error arrays (`body.errors`) get their own small shared type since the `{ message?: string }` shape is already duplicated inline in `leetcode.ts:78`
- `/api/sync`'s response type should be defined once and reused by both the route (implicitly, via its `NextResponse.json()` call shapes) and `sync-button.tsx`'s consumption of it — a shared type in `src/lib/leetcode.ts` or a small `src/types/sync.ts` (per `coding-standards.md`'s `src/types/[feature].ts` convention)
- No behavior change — this is a typing-only pass; the runtime logic, error handling, and control flow stay exactly as-is

## Edge Cases

- A cast (`as T`) is compile-time only — it does not validate the response at runtime. If LeetCode changes its schema, this won't catch it; that would need a runtime validator (e.g. zod), which is explicitly out of scope below
- Existing inline anonymous types (e.g. `(e: { message?: string })` in `leetcode.ts:78`) should be replaced by the shared named type, not left duplicated

## Out of Scope (Forward-Looking)

- Runtime schema validation (zod or similar) for any external response — this feature only adds compile-time types
- Retry logic for individual failed pagination pages (raised separately, not part of this fix)
- Touching `src/generated/prisma/**`

## History

<!-- Keep this updated. Earliest to latest -->
