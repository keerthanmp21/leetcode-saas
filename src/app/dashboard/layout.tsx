import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen bg-background">
      {/* Sidebar placeholder */}
      <aside className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <h2 className="p-4 text-lg font-semibold text-sidebar-foreground">
          Sidebar
        </h2>
      </aside>

      {/* Right column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
