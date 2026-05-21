import mongoose from "mongoose";
export declare const getTotalUnreadCount: (userId: string) => Promise<number>;
/** Number of chats that have at least one unread message for this user. */
export declare const getUnreadChatsCount: (userId: string) => Promise<number>;
export declare const getChatUnreadCount: (chatId: mongoose.Types.ObjectId | string, userId: string) => Promise<number>;
export declare const markChatAsRead: (chatId: mongoose.Types.ObjectId | string, userId: string) => Promise<void>;
