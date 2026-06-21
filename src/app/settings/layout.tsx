import { Settings } from "lucide-react"
import { DesktopSidebar, MobileSidebarTrigger } from "@/components/dashboard/sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-screen bg-background">
      <DesktopSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-background px-4 md:px-6">
          <div className="flex h-16 items-center gap-3">
            <MobileSidebarTrigger />
            <div>
              <div className="flex items-center gap-2">
                <Settings className="size-5 text-emerald-500" />
                <h1 className="text-lg font-bold text-foreground leading-none">Settings</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your LeetCode account
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
