import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth"
import { fetchAllSolvedProblems, mapDifficulty } from "@/lib/leetcode"

export async function POST() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  const session = await prisma.leetCodeSession.findUnique({
    where: { userId },
    select: { sessionToken: true, isValid: true },
  })

  if (!session || !session.isValid) {
    return NextResponse.json(
      { error: "No valid LeetCode session found. Connect your session in Settings.", settingsRequired: true },
      { status: 400 }
    )
  }

  const syncedAt = new Date()
  const result = await fetchAllSolvedProblems(session.sessionToken)

  if (!result.ok) {
    if (result.reason === "unauthorized") {
      await prisma.leetCodeSession.update({
        where: { userId },
        data: { isValid: false },
      })
      return NextResponse.json(
        { error: "LeetCode session expired. Reconnect your session in Settings.", settingsRequired: true },
        { status: 401 }
      )
    }
    return NextResponse.json({ error: "Could not reach LeetCode. Please try again." }, { status: 502 })
  }

  if (result.items.length === 0) {
    return NextResponse.json({ totalFetched: 0, newProblems: 0, syncedAt })
  }

  // Filter out items with unparseable questionFrontendId
  type ValidItem = (typeof result.items)[number] & { _questionId: number }
  const validItems: ValidItem[] = []
  for (const item of result.items) {
    const questionId = parseInt(item.question.questionFrontendId, 10)
    if (isNaN(questionId)) {
      console.warn("[sync] skipping item with invalid questionFrontendId:", item.question.questionFrontendId)
      continue
    }
    validItems.push({ ...item, _questionId: questionId })
  }

  // Batch insert new problems (skip existing by titleSlug); count tells us how many were new
  const { count: newProblems } = await prisma.problem.createMany({
    data: validItems.map((item) => ({
      questionId: item._questionId,
      title: item.question.title,
      titleSlug: item.question.titleSlug,
      difficulty: mapDifficulty(item.question.difficulty),
      topics: item.question.topicTags.map((t) => t.name),
      // acceptanceRate and isPaidOnly left as null/default — not in this response
    })),
    skipDuplicates: true,
  })

  // Resolve titleSlug → Problem.id for all items (covers newly inserted + pre-existing)
  const problemRows = await prisma.problem.findMany({
    where: { titleSlug: { in: validItems.map((i) => i.question.titleSlug) } },
    select: { id: true, titleSlug: true },
  })
  const slugToId = new Map(problemRows.map((p) => [p.titleSlug, p.id]))

  // Upsert UserProblem rows
  for (const item of validItems) {
    const problemId = slugToId.get(item.question.titleSlug)
    if (!problemId) continue

    const rawTime = item.lastAcSession?.time
    const timeMs = rawTime != null ? Number(rawTime) : NaN
    const solvedAt = Number.isFinite(timeMs) && timeMs > 0 ? new Date(timeMs) : syncedAt

    const existing = await prisma.userProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
      select: { lastSolvedAt: true },
    })

    if (!existing) {
      await prisma.userProblem.create({
        data: { userId, problemId, firstSolvedAt: solvedAt, lastSolvedAt: solvedAt },
      })
    } else if (!existing.lastSolvedAt || solvedAt > existing.lastSolvedAt) {
      await prisma.userProblem.update({
        where: { userId_problemId: { userId, problemId } },
        data: { lastSolvedAt: solvedAt },
      })
    }
  }

  return NextResponse.json({ totalFetched: result.totalNum, newProblems, syncedAt })
}
