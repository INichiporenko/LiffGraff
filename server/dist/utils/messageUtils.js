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
exports.markChatAsRead = exports.getChatUnreadCount = exports.getUnreadChatsCount = exports.getTotalUnreadCount = void 0;
const Chat_1 = __importDefault(require("../db/models/Chat"));
const Message_1 = __importDefault(require("../db/models/Message"));
const unreadFilter = (userId) => ({
    receiver: userId,
    read: { $ne: true },
});
const getTotalUnreadCount = (userId) => __awaiter(void 0, void 0, void 0, function* () { return Message_1.default.countDocuments(unreadFilter(userId)); });
exports.getTotalUnreadCount = getTotalUnreadCount;
/** Number of chats that have at least one unread message for this user. */
const getUnreadChatsCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield Chat_1.default.find({
        $or: [{ user1: userId }, { user2: userId }],
    }).select("_id messages");
    let count = 0;
    for (const chat of chats) {
        const unreadInChat = yield (0, exports.getChatUnreadCount)(chat._id, userId);
        if (unreadInChat > 0)
            count += 1;
    }
    return count;
});
exports.getUnreadChatsCount = getUnreadChatsCount;
const getChatUnreadCount = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat = yield Chat_1.default.findById(chatId).select("messages");
    if (!((_a = chat === null || chat === void 0 ? void 0 : chat.messages) === null || _a === void 0 ? void 0 : _a.length))
        return 0;
    return Message_1.default.countDocuments(Object.assign({ _id: { $in: chat.messages } }, unreadFilter(userId)));
});
exports.getChatUnreadCount = getChatUnreadCount;
const markChatAsRead = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat = yield Chat_1.default.findById(chatId).select("messages");
    if (!((_a = chat === null || chat === void 0 ? void 0 : chat.messages) === null || _a === void 0 ? void 0 : _a.length))
        return;
    yield Message_1.default.updateMany({ _id: { $in: chat.messages }, receiver: userId }, { $set: { read: true } });
});
exports.markChatAsRead = markChatAsRead;
