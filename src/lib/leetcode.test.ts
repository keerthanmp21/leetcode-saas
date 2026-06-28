import { describe, it, expect, vi, afterEach } from "vitest"
import { mapDifficulty, fetchAllSolvedProblems } from "./leetcode"

// ─── mapDifficulty ─────────────────────────────────────────────────────────────

describe("mapDifficulty", () => {
  it("maps Easy → EASY", () => {
    expect(mapDifficulty("Easy")).toBe("EASY")
  })

  it("maps Hard → HARD", () => {
    expect(mapDifficulty("Hard")).toBe("HARD")
  })

  it("maps Medium → MEDIUM", () => {
    expect(mapDifficulty("Medium")).toBe("MEDIUM")
  })

  it("defaults unknown values to MEDIUM", () => {
    expect(mapDifficulty("unknown")).toBe("MEDIUM")
    expect(mapDifficulty("")).toBe("MEDIUM")
  })
})

// ─── fetchAllSolvedProblems ────────────────────────────────────────────────────

function makeItem(slug: string) {
  return {
    totalSolves: 1,
    question: {
      title: slug,
      titleSlug: slug,
      questionFrontendId: "1",
      difficulty: "Easy",
      topicTags: [{ name: "Array" }],
    },
    lastAcSession: { time: "1700000000000" },
  }
}

function mockFetch(responses: Array<{ status?: number; body?: unknown; throws?: boolean }>) {
  let call = 0
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      const r = responses[call++] ?? responses[responses.length - 1]
      if (r.throws) throw new Error("network failure")
      const status = r.status ?? 200
      return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => r.body,
        text: async () => JSON.stringify(r.body),
      }
    })
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("fetchAllSolvedProblems", () => {
  it("returns items for a single-page result", async () => {
    mockFetch([
      {
        body: {
          data: {
            solvedQuestionsInfo: {
              totalNum: 2,
              pageNum: 1,
              data: [makeItem("two-sum"), makeItem("add-two-numbers")],
            },
          },
        },
      },
    ])

    const result = await fetchAllSolvedProblems("token")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.totalNum).toBe(2)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].question.titleSlug).toBe("two-sum")
  })

  it("accumulates items across multiple pages", async () => {
    mockFetch([
      {
        body: {
          data: {
            solvedQuestionsInfo: {
              totalNum: 2,
              pageNum: 2,
              data: [makeItem("two-sum")],
            },
          },
        },
      },
      {
        body: {
          data: {
            solvedQuestionsInfo: {
              totalNum: 2,
              pageNum: 2,
              data: [makeItem("add-two-numbers")],
            },
          },
        },
      },
    ])

    const result = await fetchAllSolvedProblems("token")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.items).toHaveLength(2)
  })

  it("returns unauthorized when the first page returns 401", async () => {
    mockFetch([{ status: 401 }])
    const result = await fetchAllSolvedProblems("bad-token")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("unauthorized")
  })

  it("returns unauthorized when a mid-pagination page returns 403", async () => {
    mockFetch([
      {
        body: {
          data: {
            solvedQuestionsInfo: {
              totalNum: 2,
              pageNum: 2,
              data: [makeItem("two-sum")],
            },
          },
        },
      },
      { status: 403 },
    ])

    const result = await fetchAllSolvedProblems("token")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("unauthorized")
  })

  it("returns network_error when fetch throws", async () => {
    mockFetch([{ throws: true }])
    const result = await fetchAllSolvedProblems("token")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("network_error")
  })

  it("returns unauthorized when LeetCode responds 200 with an auth error", async () => {
    mockFetch([
      {
        body: {
          errors: [{ message: "Please sign in to continue." }],
          data: null,
        },
      },
    ])

    const result = await fetchAllSolvedProblems("expired-token")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe("unauthorized")
  })

  it("handles zero solved problems cleanly", async () => {
    mockFetch([
      {
        body: {
          data: {
            solvedQuestionsInfo: { totalNum: 0, pageNum: 1, data: [] },
          },
        },
      },
    ])

    const result = await fetchAllSolvedProblems("token")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.items).toHaveLength(0)
    expect(result.totalNum).toBe(0)
  })
})
