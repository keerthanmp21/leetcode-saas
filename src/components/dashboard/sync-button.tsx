"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type SyncState =
  | { status: "idle" }
  | { status: "syncing" }
  | { status: "done"; message: string }
  | { status: "error"; message: string; settingsRequired?: boolean }

export function SyncButton() {
  const router = useRouter()
  const [state, setState] = useState<SyncState>({ status: "idle" })

  async function handleSync() {
    if (state.status === "syncing") return
    setState({ status: "syncing" })

    try {
      const res = await fetch("/api/sync", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        setState({
          status: "error",
          message: data.error ?? "Sync failed. Please try again.",
          settingsRequired: data.settingsRequired ?? false,
        })
        return
      }

      const { totalFetched, newProblems } = data
      const msg =
        newProblems > 0
          ? `Synced — ${newProblems} new problem${newProblems === 1 ? "" : "s"} added (${totalFetched} total)`
          : `Synced — ${totalFetched} problem${totalFetched === 1 ? "" : "s"}, nothing new`

      setState({ status: "done", message: msg })
      router.refresh()
    } catch {
      setState({ status: "error", message: "Could not reach server. Please try again." })
    }
  }

  const isSyncing = state.status === "syncing"

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-emerald-500 text-black hover:bg-emerald-400 shrink-0 disabled:opacity-60"
      >
        {isSyncing ? "Syncing…" : "Sync Now"}
      </Button>

      {state.status === "done" && (
        <p className="text-xs text-emerald-400">{state.message}</p>
      )}

      {state.status === "error" && (
        <p className="text-xs text-red-400">
          {state.message}
          {state.settingsRequired && (
            <>
              {" "}
              <a href="/settings" className="underline underline-offset-2">
                Go to Settings
              </a>
            </>
          )}
        </p>
      )}
    </div>
  )
}
