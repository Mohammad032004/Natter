import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-dvh overflow-hidden bg-white">
      {children}
    </div>
  );
}