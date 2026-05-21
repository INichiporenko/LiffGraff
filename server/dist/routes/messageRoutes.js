"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.get('/unread_count', authMiddleware_1.default, messageController_1.getUnreadMessagesCount);
router.post('/get_chat', authMiddleware_1.default, messageController_1.getChatByReceiverUsername);
router.get('/get_user_chats', authMiddleware_1.default, messageController_1.getUserChats);
exports.default = router;
