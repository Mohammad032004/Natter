
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-6 text-[#242424] sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Natter</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your personal dashboard
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-[#635bff]">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Hello, {session.username}!
          </h2>

          <p className="mt-3 text-gray-500">
            You are successfully logged in to Natter.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account email
            </p>

            <p className="mt-2 break-all text-sm font-medium">
              {session.email}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
