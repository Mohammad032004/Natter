import ChatApp from "@/components/chat/chat-app";

export const instant = false;

export default function DashboardPage() {
  return (
    <div className="h-full min-h-0">
      <ChatApp />
    </div>
  );
}