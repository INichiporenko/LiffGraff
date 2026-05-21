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
exports.dedupeNotificationsForDisplay = exports.createCommentNotification = exports.removeFollowNotification = exports.upsertFollowNotification = exports.removeCommentLikeNotification = exports.upsertCommentLikeNotification = exports.removePostLikeNotification = exports.upsertPostLikeNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Notification_1 = __importDefault(require("../db/models/Notification"));
const User_1 = __importDefault(require("../db/models/User"));
const toObjectId = (id) => typeof id === "string" ? new mongoose_1.default.Types.ObjectId(id) : id;
const attachNotificationToUser = (receiverId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.updateOne({ _id: receiverId }, { $addToSet: { notifications: notificationId } });
});
const detachNotificationFromUser = (receiverId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.updateOne({ _id: receiverId }, { $pull: { notifications: notificationId } });
});
const upsertPostLikeNotification = (receiverId, actionMakerId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);
    if (receiver.equals(actionMaker))
        return;
    const notification = yield Notification_1.default.findOneAndUpdate({
        user: receiver,
        actionMaker,
        post,
        type: "liked your post",
    }, {
        $set: { createdAt: new Date() },
        $setOnInsert: {
            user: receiver,
            actionMaker,
            post,
            type: "liked your post",
        },
    }, { upsert: true, new: true });
    yield attachNotificationToUser(receiver, notification._id);
});
exports.upsertPostLikeNotification = upsertPostLikeNotification;
const removePostLikeNotification = (receiverId, actionMakerId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);
    const notification = yield Notification_1.default.findOneAndDelete({
        user: receiver,
        actionMaker,
        post,
        type: "liked your post",
    });
    if (notification) {
        yield detachNotificationFromUser(receiver, notification._id);
    }
});
exports.removePostLikeNotification = removePostLikeNotification;
const upsertCommentLikeNotification = (receiverId, actionMakerId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const comment = toObjectId(commentId);
    if (receiver.equals(actionMaker))
        return;
    const notification = yield Notification_1.default.findOneAndUpdate({
        user: receiver,
        actionMaker,
        comment,
        type: "liked your comment",
    }, {
        $set: { createdAt: new Date() },
        $setOnInsert: {
            user: receiver,
            actionMaker,
            comment,
            type: "liked your comment",
        },
    }, { upsert: true, new: true });
    yield attachNotificationToUser(receiver, notification._id);
});
exports.upsertCommentLikeNotification = upsertCommentLikeNotification;
const removeCommentLikeNotification = (receiverId, actionMakerId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const comment = toObjectId(commentId);
    const notification = yield Notification_1.default.findOneAndDelete({
        user: receiver,
        actionMaker,
        comment,
        type: "liked your comment",
    });
    if (notification) {
        yield detachNotificationFromUser(receiver, notification._id);
    }
});
exports.removeCommentLikeNotification = removeCommentLikeNotification;
const upsertFollowNotification = (receiverId, actionMakerId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    if (receiver.equals(actionMaker))
        return;
    const notification = yield Notification_1.default.findOneAndUpdate({
        user: receiver,
        actionMaker,
        type: "started following you",
    }, {
        $set: { createdAt: new Date() },
        $setOnInsert: {
            user: receiver,
            actionMaker,
            type: "started following you",
        },
    }, { upsert: true, new: true });
    yield attachNotificationToUser(receiver, notification._id);
});
exports.upsertFollowNotification = upsertFollowNotification;
const removeFollowNotification = (receiverId, actionMakerId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const notification = yield Notification_1.default.findOneAndDelete({
        user: receiver,
        actionMaker,
        type: "started following you",
    });
    if (notification) {
        yield detachNotificationFromUser(receiver, notification._id);
    }
});
exports.removeFollowNotification = removeFollowNotification;
const createCommentNotification = (receiverId, actionMakerId, postId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);
    const comment = toObjectId(commentId);
    if (receiver.equals(actionMaker))
        return;
    const notification = yield Notification_1.default.findOneAndUpdate({
        user: receiver,
        actionMaker,
        comment,
        type: "commented on your post",
    }, {
        $set: { createdAt: new Date(), post },
        $setOnInsert: {
            user: receiver,
            actionMaker,
            post,
            comment,
            type: "commented on your post",
        },
    }, { upsert: true, new: true });
    yield attachNotificationToUser(receiver, notification._id);
});
exports.createCommentNotification = createCommentNotification;
const dedupeNotificationsForDisplay = (notifications, limit = 10) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const byKey = new Map();
    for (const notification of notifications) {
        const actionMakerId = String((_b = (_a = notification.actionMaker) === null || _a === void 0 ? void 0 : _a._id) !== null && _b !== void 0 ? _b : "");
        const postId = String((_d = (_c = notification.post) === null || _c === void 0 ? void 0 : _c._id) !== null && _d !== void 0 ? _d : "");
        const commentId = String((_f = (_e = notification.comment) === null || _e === void 0 ? void 0 : _e._id) !== null && _f !== void 0 ? _f : "");
        const key = `${notification.type}|${actionMakerId}|${postId}|${commentId}`;
        const existing = byKey.get(key);
        if (!existing) {
            byKey.set(key, notification);
            continue;
        }
        const existingTime = new Date((_g = existing.createdAt) !== null && _g !== void 0 ? _g : 0).getTime();
        const currentTime = new Date((_h = notification.createdAt) !== null && _h !== void 0 ? _h : 0).getTime();
        if (currentTime > existingTime) {
            byKey.set(key, notification);
        }
    }
    return Array.from(byKey.values())
        .sort((a, b) => {
        var _a, _b;
        return new Date((_a = b.createdAt) !== null && _a !== void 0 ? _a : 0).getTime() -
            new Date((_b = a.createdAt) !== null && _b !== void 0 ? _b : 0).getTime();
    })
        .slice(0, limit);
};
exports.dedupeNotificationsForDisplay = dedupeNotificationsForDisplay;
