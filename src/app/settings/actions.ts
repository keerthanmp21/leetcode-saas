"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth"
import { validateLeetCodeUsername, validateLeetCodeSession } from "@/lib/leetcode"

export type ActionResult = { success?: string; error?: string }

export async function saveUsernameAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return { error: "Not authenticated. Set DEMO_USER_ID in .env.local to test." }
  }

  const username = (formData.get("username") as string)?.trim()
  if (!username) return { error: "Username is required." }

  const result = await validateLeetCodeUsername(username)
  if (!result.found) {
    if (result.reason === "network_error") {
      return { error: "Could not reach LeetCode. Please try again." }
    }
    return { error: `Username "${username}" was not found on LeetCode.` }
  }

  // upsert: creates the User row on first use (dev only), updates on every call after
  await prisma.user.upsert({
    where: { id: userId },
    update: { leetcodeUsername: username },
    create: { id: userId, leetcodeUsername: username },
  })

  revalidatePath("/settings")
  return { success: "Username saved." }
}

export async function saveSessionAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return { error: "Not authenticated. Set DEMO_USER_ID in .env.local to test." }
  }

  const sessionToken = (formData.get("sessionToken") as string)?.trim()
  if (!sessionToken) return { error: "Session token is required." }

  // Fetch the stored username — required before connecting a session
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { leetcodeUsername: true },
  })
  const expectedUsername = user?.leetcodeUsername ?? undefined

  if (!expectedUsername) {
    return { error: "Save your LeetCode username first before connecting a session." }
  }

  const result = await validateLeetCodeSession(sessionToken, expectedUsername)
  if (!result.valid) {
    if (result.reason === "network_error") {
      return { error: "Could not reach LeetCode. Please try again later." }
    }
    if (result.reason === "wrong_account") {
      return {
        error: `This session belongs to a different LeetCode account. Make sure you copy the LEETCODE_SESSION cookie from the account matching your saved username (${expectedUsername}).`,
      }
    }
    return {
      error:
        "Session is invalid or expired. Get a fresh LEETCODE_SESSION cookie from leetcode.com.",
    }
  }

  // ensure the User row exists (dev only) before upserting the session FK
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  })

  // TODO: encrypt sessionToken at rest before storing (e.g. AES-GCM with a server-side key).
  await prisma.leetCodeSession.upsert({
    where: { userId },
    update: { sessionToken, isValid: true, lastValidatedAt: new Date() },
    create: { userId, sessionToken, isValid: true, lastValidatedAt: new Date() },
  })

  revalidatePath("/settings")
  return { success: "Session connected successfully." }
}
