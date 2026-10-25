export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
};

export type ChatConversation = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];

  // Conversation properties
  isFavorite?: boolean;
  isGroup?: boolean;
};