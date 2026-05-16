import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Zap } from "lucide-react"
import { DesktopSidebar, MobileSidebarTrigger } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-screen bg-background">
      <DesktopSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-background px-4 md:px-6">
          {/* Single row on desktop, top row on mobile */}
          <div className="flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-3">
              <MobileSidebarTrigger />
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="size-5 fill-emerald-500 text-emerald-500" />
                  <h1 className="text-lg font-bold text-foreground leading-none">Dashboard</h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track your LeetCode progress
                </p>
              </div>
            </div>

            <div className="relative hidden w-56 md:block">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8" />
            </div>

            <div className="flex justify-end">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400 shrink-0">
                Sync Now
              </Button>
            </div>
          </div>

          {/* Search row — mobile only */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 w-full" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
