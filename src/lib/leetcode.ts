
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Origin": "https://leetcode.com",
  "Referer": "https://leetcode.com/",
}

const SOLVED_QUESTIONS_QUERY = `
  query($pageNo: Int!, $numPerPage: Int!) {
    solvedQuestionsInfo(filters: {}, pageNo: $pageNo, numPerPage: $numPerPage) {
      totalNum
      pageNum
      data {
        totalSolves
        question {
          title
          titleSlug
          questionFrontendId
          difficulty
          topicTags { name }
        }
        lastAcSession { time }
      }
    }
  }
`

export type SolvedQuestionItem = {
  question: {
    title: string
    titleSlug: string
    questionFrontendId: string
    difficulty: string
    topicTags: { name: string }[]
  }
  lastAcSession: { time: string | null } | null
}

export type FetchSolvedResult =
  | { ok: true; items: SolvedQuestionItem[]; totalNum: number }
  | { ok: false; reason: "unauthorized" | "network_error" }

type GraphQLError = { message?: string }

interface SolvedQuestionsGraphQLResponse {
  data?: {
    solvedQuestionsInfo?: {
      totalNum: number
      pageNum: number
      data: SolvedQuestionItem[]
    }
  }
  errors?: GraphQLError[]
}

interface MatchedUserGraphQLResponse {
  data?: {
    matchedUser?: { username: string } | null
  }
  errors?: GraphQLError[]
}

interface UserStatusGraphQLResponse {
  data?: {
    userStatus?: { isSignedIn: boolean; username: string }
  }
  errors?: GraphQLError[]
}

async function fetchSolvedPage(
  sessionToken: string,
  pageNo: number,
  numPerPage: number
): Promise<{ ok: true; totalNum: number; pageNum: number; data: SolvedQuestionItem[] } | { ok: false; reason: "unauthorized" | "network_error" }> {
  try {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        ...BASE_HEADERS,
        Cookie: `LEETCODE_SESSION=${sessionToken}`,
        "x-csrftoken": "csrftoken",
      },
      body: JSON.stringify({ query: SOLVED_QUESTIONS_QUERY, variables: { pageNo, numPerPage } }),
      cache: "no-store",
    })

    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "unauthorized" }
    }
    if (!res.ok) {
      console.error("[leetcode] fetchSolvedPage status:", res.status)
      return { ok: false, reason: "network_error" }
    }

    const body = (await res.json()) as SolvedQuestionsGraphQLResponse
    const info = body?.data?.solvedQuestionsInfo
    if (!info || body?.errors) {
      // LeetCode returns 200 with errors for invalid sessions
      const hasAuthError = body?.errors?.some((e) =>
        /sign in|authenticate|unauthorized/i.test(e.message ?? "")
      )
      return { ok: false, reason: hasAuthError ? "unauthorized" : "network_error" }
    }

    return { ok: true, totalNum: info.totalNum, pageNum: info.pageNum, data: info.data }
  } catch (err) {
    console.error("[leetcode] fetchSolvedPage error:", err)
    return { ok: false, reason: "network_error" }
  }
}

export async function fetchAllSolvedProblems(sessionToken: string): Promise<FetchSolvedResult> {
  const NUM_PER_PAGE = 50

  const first = await fetchSolvedPage(sessionToken, 1, NUM_PER_PAGE)
  if (!first.ok) return first

  const { totalNum, pageNum, data: firstData } = first
  if (pageNum <= 1) return { ok: true, items: firstData, totalNum }

  const items: SolvedQuestionItem[] = [...firstData]
  for (let page = 2; page <= pageNum; page++) {
    const result = await fetchSolvedPage(sessionToken, page, NUM_PER_PAGE)
    if (!result.ok) return result
    items.push(...result.data)
  }

  return { ok: true, items, totalNum }
}

export function mapDifficulty(raw: string) {
  if (raw === "Easy") return "EASY"
  if (raw === "Hard") return "HARD"
  return "MEDIUM"
}

export type UsernameValidationResult =
  | { found: true }
  | { found: false; reason: "not_found" | "network_error" }

export async function validateLeetCodeUsername(
  username: string
): Promise<UsernameValidationResult> {
  try {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: BASE_HEADERS,
      body: JSON.stringify({
        query: `{ matchedUser(username: ${JSON.stringify(username)}) { username } }`,
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("[leetcode] validateUsername status:", res.status, await res.text().catch(() => ""))
      return { found: false, reason: "network_error" }
    }

    const data = (await res.json()) as MatchedUserGraphQLResponse
    return data?.data?.matchedUser
      ? { found: true }
      : { found: false, reason: "not_found" }
  } catch (err) {
    console.error("[leetcode] validateUsername error:", err)
    return { found: false, reason: "network_error" }
  }
}

export type SessionValidationResult =
  | { valid: true; username: string }
  | { valid: false; reason: "invalid" | "network_error" | "wrong_account" }

/**
 * Validates a LEETCODE_SESSION token via the `userStatus` query.
 *
 * We use `userStatus { isSignedIn username }` rather than the spec's `solvedQuestionsInfo`
 * because it's a lighter call (no pagination, no problem data) and critically returns
 * `username` — which lets us reject sessions from a different LeetCode account in one
 * round-trip. `solvedQuestionsInfo` would need a separate identity check.
 *
 * If expectedUsername is provided, the session username must match (case-insensitive) —
 * this prevents the case where the browser stores a session from a different account.
 */
export async function validateLeetCodeSession(
  sessionToken: string,
  expectedUsername?: string
): Promise<SessionValidationResult> {
  try {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        ...BASE_HEADERS,
        Cookie: `LEETCODE_SESSION=${sessionToken}`,
        "x-csrftoken": "csrftoken",
      },
      body: JSON.stringify({
        query: `{ userStatus { isSignedIn username } }`,
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("[leetcode] validateSession status:", res.status, await res.text().catch(() => ""))
      if (res.status === 401 || res.status === 403) {
        return { valid: false, reason: "invalid" }
      }
      return { valid: false, reason: "network_error" }
    }

    const data = (await res.json()) as UserStatusGraphQLResponse
    const status = data?.data?.userStatus

    if (data?.errors || !status || !status.isSignedIn) {
      return { valid: false, reason: "invalid" }
    }

    const sessionUsername: string = status.username

    if (expectedUsername && sessionUsername.toLowerCase() !== expectedUsername.toLowerCase()) {
      return { valid: false, reason: "wrong_account" }
    }

    return { valid: true, username: sessionUsername }
  } catch (err) {
    console.error("[leetcode] validateSession error:", err)
    return { valid: false, reason: "network_error" }
  }
}
