import { Server } from "socket.io";
import http from "http";
import Chat from "../db/models/Chat";
import Message from "../db/models/Message";
import { getChatUnreadCount, getUnreadChatsCount, markChatAsRead } from "../utils/messageUtils";
import 'dotenv/config';

const userRoom = (userId: string) => `user:${userId}`;

export const initializeSocket = (server: http.Server) => {
    const origin = process.env.CLIENT_URL || "http://localhost:5173";
    const io = new Server(server, {
        cors: {
            origin: origin,
        },
    });

    io.on("connection", (socket) => {
        //console.log("A user connected:", socket.id);

        // Assign the user to a room based on their ID
        socket.on("joinRoom", (chatId: string) => {
            socket.join(chatId);
        });

        socket.on("joinUser", (userId: string) => {
            if (userId) socket.join(userRoom(userId));
        });

        socket.on("markChatRead", async ({ chatId, userId }) => {
            try {
                if (!chatId || !userId) return;
                await markChatAsRead(chatId, userId);
                const unreadChatsCount = await getUnreadChatsCount(userId);
                io.to(userRoom(userId)).emit("unreadUpdate", {
                    unreadChatsCount,
                    chatId,
                    chatUnread: 0,
                });
            } catch (error) {
                console.error("Error marking chat as read:", error);
            }
        });

        // Listen for a new message event
        socket.on("sendMessage", async ({ authorId, receiverId, content }) => {
            try {
                // Find or create the chat between users
                //console.log("sendMessage", content);
                let chat = await Chat.findOne({
                    $or: [
                        { user1: authorId, user2: receiverId },
                        { user1: receiverId, user2: authorId },
                    ],
                });

                if (!chat) {
                    chat = new Chat({
                        user1: authorId,
                        user2: receiverId,
                    });
                    await chat.save();
                }

                // Save the new message
                const newMessage = await Message.create({
                    author: authorId,
                    receiver: receiverId,
                    content: content,
                    read: false,
                });

                // Update chat with the new message
                chat.messages.push(newMessage._id);
                chat.last_message = newMessage._id;
                await chat.save();

                await newMessage.populate({
                    path: 'author',
                    select: 'username profile_image',
                });
                await newMessage.populate({
                    path: 'receiver',
                    select: 'username profile_image _id',
                });

                io.to(chat._id.toString()).emit("receiveMessage", newMessage);

                const unreadChatsCount = await getUnreadChatsCount(receiverId);
                const chatUnread = await getChatUnreadCount(chat._id, receiverId);
                io.to(userRoom(receiverId)).emit("unreadUpdate", {
                    unreadChatsCount,
                    chatId: chat._id.toString(),
                    chatUnread,
                });
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            //console.log("A user disconnected:", socket.id);
        });
    });
};
