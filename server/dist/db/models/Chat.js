"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    user1: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    user2: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    messages: [{ type: mongoose_1.default.Types.ObjectId, ref: "Message" }],
    last_message: { type: mongoose_1.default.Types.ObjectId, ref: "Message" }
});
const Chat = mongoose_1.default.model("Chat", ChatSchema);
exports.default = Chat;
