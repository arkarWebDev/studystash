import { TopBar } from "@/components/dashboard/TopBar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-sidebar p-4 text-sidebar-foreground md:block">
          <h2>Sidebar</h2>
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
