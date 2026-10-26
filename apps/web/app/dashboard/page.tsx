import ChatApp from "@/components/chat/chat-app";
import { getSession } from "@/lib/auth";

export const instant = false;

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <div className="h-full min-h-0">
      <ChatApp currentUserId={session.userId} />
    </div>
  );
}