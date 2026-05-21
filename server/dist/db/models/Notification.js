"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, required: true, ref: "User" },
    actionMaker: { type: mongoose_1.default.Types.ObjectId, required: true, ref: "User" },
    post: { type: mongoose_1.default.Types.ObjectId, ref: "Post" },
    comment: { type: mongoose_1.default.Types.ObjectId, ref: "Comment" },
    createdAt: { type: Date, default: Date.now },
    type: { "type": String, required: true, "enum": [
            "liked your post",
            "liked your comment",
            "commented on your post",
            "started following you"
        ] },
});
NotificationSchema.index({ user: 1, actionMaker: 1, post: 1, type: 1 }, {
    unique: true,
    partialFilterExpression: { type: "liked your post" },
});
NotificationSchema.index({ user: 1, actionMaker: 1, comment: 1, type: 1 }, {
    unique: true,
    partialFilterExpression: { type: "liked your comment" },
});
NotificationSchema.index({ user: 1, actionMaker: 1, type: 1 }, {
    unique: true,
    partialFilterExpression: { type: "started following you" },
});
const Notification = mongoose_1.default.model("Notification", NotificationSchema);
exports.default = Notification;
