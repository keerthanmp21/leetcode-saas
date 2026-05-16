"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

type NavItemProps = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  isCollapsed?: boolean
  onClick?: () => void
}

function NavItem({ href, icon: Icon, label, isCollapsed, onClick }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href + "/"))

  return (
    <Link
      href={href}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isCollapsed && "justify-center px-2",
        isActive
          ? "bg-emerald-500 text-black"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="size-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

function SidebarBody({
  isCollapsed,
  onToggle,
  onNavClick,
}: {
  isCollapsed?: boolean
  onToggle?: () => void
  onNavClick?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border px-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <span className="text-base font-bold text-sidebar-foreground">LeetCode</span>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="size-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isCollapsed={isCollapsed}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div
        className={cn(
          "flex items-center gap-3 border-t border-sidebar-border p-3",
          isCollapsed && "justify-center"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-black">
          U
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">User</p>
            <p className="truncate text-xs text-muted-foreground">user@example.com</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function DesktopSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out md:flex",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      <SidebarBody
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
      />
    </aside>
  )
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-8 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-56 p-0 bg-sidebar border-r border-sidebar-border"
      >
        <SidebarBody onNavClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
