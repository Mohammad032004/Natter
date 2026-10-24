export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
};

export type ChatConversation = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
};