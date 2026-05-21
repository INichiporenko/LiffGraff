"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LikeSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
        default: undefined,
    },
    commentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        default: undefined,
    },
}, { minimize: true });
// Partial indexes: only post likes / comment likes are indexed (null fields are ignored).
LikeSchema.index({ postId: 1, userId: 1 }, {
    unique: true,
    partialFilterExpression: { postId: { $exists: true, $type: "objectId" } },
});
LikeSchema.index({ commentId: 1, userId: 1 }, {
    unique: true,
    partialFilterExpression: { commentId: { $exists: true, $type: "objectId" } },
});
const Like = mongoose_1.default.model("Like", LikeSchema);
exports.default = Like;
