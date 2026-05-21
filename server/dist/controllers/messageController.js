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
exports.getUnreadMessagesCount = exports.getUserChats = exports.getChatByReceiverUsername = void 0;
const User_1 = __importDefault(require("../db/models/User"));
const Chat_1 = __importDefault(require("../db/models/Chat"));
const messageUtils_1 = require("../utils/messageUtils");
const getChatByReceiverUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverUsername } = req.body;
        if (!receiverUsername || !req.user) {
            res.status(400).send('Receiver and sender must be provided');
            return;
        }
        const receiver = yield User_1.default.findOne({ username: receiverUsername });
        if (!receiver) {
            res.status(404).send('User is not found');
            return;
        }
        let chat = yield Chat_1.default.findOne({
            $or: [
                { user1: req.user.id, user2: receiver._id },
                { user1: receiver._id, user2: req.user.id }
            ]
        }).populate({
            path: 'messages',
            select: 'content createdAt read author receiver',
            populate: [{
                    path: 'author',
                    select: 'profile_image username'
                }, {
                    path: 'receiver',
                    select: 'profile_image username _id'
                }]
        }).populate({
            path: 'user1',
            select: 'profile_image username _id'
        }).populate({
            path: 'user2',
            select: 'profile_image username _id'
        });
        if (!chat) {
            chat = new Chat_1.default({
                user1: req.user.id,
                user2: receiver._id,
            });
            yield chat.save();
            yield chat.populate({
                path: 'messages',
                select: 'content createdAt read author receiver',
                populate: [{
                        path: 'author',
                        select: 'profile_image username'
                    }, {
                        path: 'receiver',
                        select: 'profile_image username _id'
                    }]
            });
            yield chat.populate({
                path: 'user1',
                select: 'profile_image username _id'
            });
            yield chat.populate({
                path: 'user2',
                select: 'profile_image username _id'
            });
        }
        else {
            yield (0, messageUtils_1.markChatAsRead)(chat._id, req.user.id);
        }
        const unreadChatsCount = yield (0, messageUtils_1.getUnreadChatsCount)(req.user.id);
        res.status(200).json(Object.assign(Object.assign({}, chat.toObject()), { unreadCount: 0, unreadChatsCount }));
    }
    catch (error) {
        console.error('Error getting chat: ', error);
        res.status(500).send('Error getting chat');
    }
});
exports.getChatByReceiverUsername = getChatByReceiverUsername;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(404).send('User not found');
            return;
        }
        const chats = yield Chat_1.default.find({
            $or: [
                { user1: req.user.id },
                { user2: req.user.id }
            ]
        }).populate({
            path: 'user1',
            select: 'profile_image username _id'
        }).populate({
            path: 'user2',
            select: 'profile_image username _id'
        }).populate({
            path: 'last_message',
            populate: {
                path: 'author',
                select: 'username profile_image'
            }
        });
        const chatsWithUnread = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const unreadCount = yield (0, messageUtils_1.getChatUnreadCount)(chat._id, req.user.id);
            return Object.assign(Object.assign({}, chat.toObject()), { unreadCount });
        })));
        res.status(200).send(chatsWithUnread);
    }
    catch (error) {
        console.error('Error getting user chats: ', error);
        res.status(500).send('Error getting user chats');
    }
});
exports.getUserChats = getUserChats;
const getUnreadMessagesCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const unreadChatsCount = yield (0, messageUtils_1.getUnreadChatsCount)(req.user.id);
        res.status(200).json({ unreadChatsCount });
    }
    catch (error) {
        console.error('Error getting unread messages count: ', error);
        res.status(500).send('Error getting unread messages count');
    }
});
exports.getUnreadMessagesCount = getUnreadMessagesCount;
