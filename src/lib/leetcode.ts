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

    const data = await res.json()
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

    const data = await res.json()
    const status = data?.data?.userStatus

    if (data?.errors || !status?.isSignedIn) {
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
