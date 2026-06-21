"use client"

import { useActionState, useState, useEffect } from "react"
import { saveUsernameAction, type ActionResult } from "@/app/settings/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  initialUsername: string | null
  isAuthenticated: boolean
}

export function UsernameForm({ initialUsername, isAuthenticated }: Props) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    saveUsernameAction,
    {}
  )
  const [value, setValue] = useState(initialUsername ?? "")

  // Sync when server re-renders with a new saved value after revalidatePath
  useEffect(() => {
    setValue(initialUsername ?? "")
  }, [initialUsername])

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">LeetCode Username</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Used for public profile stats and recent submissions. Set once — only update if you
          need to correct a typo.
        </p>
      </div>

      <form action={action} className="flex items-center gap-3">
        <Input
          name="username"
          placeholder="e.g. john-doe"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-xs"
          disabled={!isAuthenticated || pending}
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={!isAuthenticated || pending}
          className="bg-emerald-500 text-black hover:bg-emerald-400 shrink-0"
        >
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground">Sign in to save settings.</p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-500">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  )
}
