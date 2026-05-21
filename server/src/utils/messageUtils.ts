import mongoose from "mongoose";
import Chat from "../db/models/Chat";
import Message from "../db/models/Message";

const unreadFilter = (userId: string) => ({
    receiver: userId,
    read: { $ne: true },
});

export const getTotalUnreadCount = async (userId: string): Promise<number> =>
    Message.countDocuments(unreadFilter(userId));

/** Number of chats that have at least one unread message for this user. */
export const getUnreadChatsCount = async (userId: string): Promise<number> => {
    const chats = await Chat.find({
        $or: [{ user1: userId }, { user2: userId }],
    }).select("_id messages");

    let count = 0;
    for (const chat of chats) {
        const unreadInChat = await getChatUnreadCount(chat._id, userId);
        if (unreadInChat > 0) count += 1;
    }
    return count;
};

export const getChatUnreadCount = async (
    chatId: mongoose.Types.ObjectId | string,
    userId: string
): Promise<number> => {
    const chat = await Chat.findById(chatId).select("messages");
    if (!chat?.messages?.length) return 0;

    return Message.countDocuments({
        _id: { $in: chat.messages },
        ...unreadFilter(userId),
    });
};

export const markChatAsRead = async (
    chatId: mongoose.Types.ObjectId | string,
    userId: string
): Promise<void> => {
    const chat = await Chat.findById(chatId).select("messages");
    if (!chat?.messages?.length) return;

    await Message.updateMany(
        { _id: { $in: chat.messages }, receiver: userId },
        { $set: { read: true } }
    );
};
