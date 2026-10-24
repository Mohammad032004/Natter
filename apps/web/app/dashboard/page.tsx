import ChatApp from "@/components/chat/chat-app";

export const instant = false;

export default function DashboardPage() {
  return (
    <main className="h-full min-h-0">
      <ChatApp />
    </main>
  );
}