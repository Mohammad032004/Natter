import type { ReactNode } from "react";

import NavRail from "./nav-rail";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      {/* Left navigation rail */}
      <NavRail />

      {/* Active section */}
      <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}