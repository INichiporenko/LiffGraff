"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    photos: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Photo" }],
    content: { type: String, required: true, maxlength: 2200 },
    website: { type: String },
    createdAt: { type: Date, default: Date.now },
    like_count: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
