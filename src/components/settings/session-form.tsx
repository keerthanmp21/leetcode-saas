"use client"

import { useActionState } from "react"
import { saveSessionAction, type ActionResult } from "@/app/settings/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type SessionStatus = "not_connected" | "connected" | "expired"

type Props = {
  status: SessionStatus
  lastValidatedAt: Date | null
  isAuthenticated: boolean
  usernameRequired: boolean
}

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; className: string }
> = {
  not_connected: {
    label: "Not Connected",
    className: "bg-muted text-muted-foreground",
  },
  connected: {
    label: "Connected",
    className: "bg-emerald-500/15 text-emerald-500",
  },
  expired: {
    label: "Expired / Invalid",
    className: "bg-amber-500/15 text-amber-500",
  },
}

export function SessionForm({ status, lastValidatedAt, isAuthenticated, usernameRequired }: Props) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    saveSessionAction,
    {}
  )

  const cfg = STATUS_CONFIG[status]

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">LeetCode Session</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              LEETCODE_SESSION
            </code>{" "}
            cookie from leetcode.com — required for fetching your full solved problem list.
            Expires every ~2 weeks and will need to be re-entered when it does.
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            pending ? "bg-muted text-muted-foreground" : cfg.className
          )}
        >
          {pending ? "Validating…" : cfg.label}
        </span>
      </div>

      {status === "connected" && lastValidatedAt && !pending && (
        <p className="text-xs text-muted-foreground">
          Last connected:{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(lastValidatedAt)}
        </p>
      )}

      <form action={action} className="space-y-3">
        <div>
          <label
            htmlFor="sessionToken"
            className="text-sm font-medium text-foreground block mb-1.5"
          >
            Session Token
          </label>
          <Input
            id="sessionToken"
            name="sessionToken"
            type="password"
            placeholder="Paste your LEETCODE_SESSION value here"
            className="font-mono text-sm"
            disabled={!isAuthenticated || usernameRequired || pending}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Chrome: leetcode.com → DevTools (F12) → Application → Cookies →{" "}
            <code className="font-mono">LEETCODE_SESSION</code>
          </p>
        </div>

        <Button
          type="submit"
          disabled={!isAuthenticated || usernameRequired || pending}
          className="bg-emerald-500 text-black hover:bg-emerald-400"
        >
          {pending
            ? "Validating…"
            : status === "connected"
              ? "Reconnect"
              : "Connect"}
        </Button>
      </form>

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground">Sign in to save settings.</p>
      )}
      {isAuthenticated && usernameRequired && (
        <p className="text-sm text-muted-foreground">
          Save your LeetCode username above before connecting a session.
        </p>
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
