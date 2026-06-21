import { prisma } from "@/lib/prisma"
import { getCurrentUserId } from "@/lib/auth"
import { validateLeetCodeSession } from "@/lib/leetcode"
import { UsernameForm } from "@/components/settings/username-form"
import { SessionForm, type SessionStatus } from "@/components/settings/session-form"

export default async function SettingsPage() {
  const userId = await getCurrentUserId()

  let username: string | null = null
  let sessionStatus: SessionStatus = "not_connected"
  let lastValidatedAt: Date | null = null

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        leetcodeUsername: true,
        leetcodeSession: {
          select: { sessionToken: true, isValid: true, lastValidatedAt: true },
        },
      },
    })

    username = user?.leetcodeUsername ?? null

    const session = user?.leetcodeSession
    if (session) {
      if (session.isValid) {
        // Re-validate on each page load to catch silently expired sessions.
        const check = await validateLeetCodeSession(session.sessionToken)
        if (check.valid) {
          sessionStatus = "connected"
          lastValidatedAt = session.lastValidatedAt
        } else {
          // Session expired since we last stored it — mark it in the DB.
          await prisma.leetCodeSession.update({
            where: { userId },
            data: { isValid: false },
          })
          sessionStatus = "expired"
          lastValidatedAt = session.lastValidatedAt
        }
      } else if (session.lastValidatedAt) {
        sessionStatus = "expired"
        lastValidatedAt = session.lastValidatedAt
      }
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <UsernameForm initialUsername={username} isAuthenticated={!!userId} />
      <SessionForm
        status={sessionStatus}
        lastValidatedAt={lastValidatedAt}
        isAuthenticated={!!userId}
        usernameRequired={!username}
      />
    </div>
  )
}
