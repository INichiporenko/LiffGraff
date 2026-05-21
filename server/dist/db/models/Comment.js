"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    post: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    like_count: { type: Number, required: true, default: 0 },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Like" }],
    createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.default = Comment;
