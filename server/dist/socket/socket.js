"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const Chat_1 = __importDefault(require("../db/models/Chat"));
const Message_1 = __importDefault(require("../db/models/Message"));
const messageUtils_1 = require("../utils/messageUtils");
require("dotenv/config");
const userRoom = (userId) => `user:${userId}`;
const initializeSocket = (server) => {
    const origin = process.env.CLIENT_URL || "http://localhost:5173";
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: origin,
        },
    });
    io.on("connection", (socket) => {
        //console.log("A user connected:", socket.id);
        // Assign the user to a room based on their ID
        socket.on("joinRoom", (chatId) => {
            socket.join(chatId);
        });
        socket.on("joinUser", (userId) => {
            if (userId)
                socket.join(userRoom(userId));
        });
        socket.on("markChatRead", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, userId }) {
            try {
                if (!chatId || !userId)
                    return;
                yield (0, messageUtils_1.markChatAsRead)(chatId, userId);
                const unreadChatsCount = yield (0, messageUtils_1.getUnreadChatsCount)(userId);
                io.to(userRoom(userId)).emit("unreadUpdate", {
                    unreadChatsCount,
                    chatId,
                    chatUnread: 0,
                });
            }
            catch (error) {
                console.error("Error marking chat as read:", error);
            }
        }));
        // Listen for a new message event
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ authorId, receiverId, content }) {
            try {
                // Find or create the chat between users
                //console.log("sendMessage", content);
                let chat = yield Chat_1.default.findOne({
                    $or: [
                        { user1: authorId, user2: receiverId },
                        { user1: receiverId, user2: authorId },
                    ],
                });
                if (!chat) {
                    chat = new Chat_1.default({
                        user1: authorId,
                        user2: receiverId,
                    });
                    yield chat.save();
                }
                // Save the new message
                const newMessage = yield Message_1.default.create({
                    author: authorId,
                    receiver: receiverId,
                    content: content,
                    read: false,
                });
                // Update chat with the new message
                chat.messages.push(newMessage._id);
                chat.last_message = newMessage._id;
                yield chat.save();
                yield newMessage.populate({
                    path: 'author',
                    select: 'username profile_image',
                });
                yield newMessage.populate({
                    path: 'receiver',
                    select: 'username profile_image _id',
                });
                io.to(chat._id.toString()).emit("receiveMessage", newMessage);
                const unreadChatsCount = yield (0, messageUtils_1.getUnreadChatsCount)(receiverId);
                const chatUnread = yield (0, messageUtils_1.getChatUnreadCount)(chat._id, receiverId);
                io.to(userRoom(receiverId)).emit("unreadUpdate", {
                    unreadChatsCount,
                    chatId: chat._id.toString(),
                    chatUnread,
                });
            }
            catch (error) {
                console.error("Error saving message:", error);
            }
        }));
        // Handle disconnection
        socket.on("disconnect", () => {
            //console.log("A user disconnected:", socket.id);
        });
    });
};
exports.initializeSocket = initializeSocket;
