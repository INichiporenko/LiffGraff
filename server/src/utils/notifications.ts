import mongoose from "mongoose";
import Notification from "../db/models/Notification";
import User from "../db/models/User";

const toObjectId = (id: mongoose.Types.ObjectId | string) =>
    typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;

const attachNotificationToUser = async (
    receiverId: mongoose.Types.ObjectId,
    notificationId: mongoose.Types.ObjectId
) => {
    await User.updateOne(
        { _id: receiverId },
        { $addToSet: { notifications: notificationId } }
    );
};

const detachNotificationFromUser = async (
    receiverId: mongoose.Types.ObjectId,
    notificationId: mongoose.Types.ObjectId
) => {
    await User.updateOne(
        { _id: receiverId },
        { $pull: { notifications: notificationId } }
    );
};

export const upsertPostLikeNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string,
    postId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);

    if (receiver.equals(actionMaker)) return;

    const notification = await Notification.findOneAndUpdate(
        {
            user: receiver,
            actionMaker,
            post,
            type: "liked your post",
        },
        {
            $set: { createdAt: new Date() },
            $setOnInsert: {
                user: receiver,
                actionMaker,
                post,
                type: "liked your post",
            },
        },
        { upsert: true, new: true }
    );

    await attachNotificationToUser(receiver, notification._id);
};

export const removePostLikeNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string,
    postId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);

    const notification = await Notification.findOneAndDelete({
        user: receiver,
        actionMaker,
        post,
        type: "liked your post",
    });

    if (notification) {
        await detachNotificationFromUser(receiver, notification._id);
    }
};

export const upsertCommentLikeNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string,
    commentId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const comment = toObjectId(commentId);

    if (receiver.equals(actionMaker)) return;

    const notification = await Notification.findOneAndUpdate(
        {
            user: receiver,
            actionMaker,
            comment,
            type: "liked your comment",
        },
        {
            $set: { createdAt: new Date() },
            $setOnInsert: {
                user: receiver,
                actionMaker,
                comment,
                type: "liked your comment",
            },
        },
        { upsert: true, new: true }
    );

    await attachNotificationToUser(receiver, notification._id);
};

export const removeCommentLikeNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string,
    commentId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const comment = toObjectId(commentId);

    const notification = await Notification.findOneAndDelete({
        user: receiver,
        actionMaker,
        comment,
        type: "liked your comment",
    });

    if (notification) {
        await detachNotificationFromUser(receiver, notification._id);
    }
};

export const upsertFollowNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);

    if (receiver.equals(actionMaker)) return;

    const notification = await Notification.findOneAndUpdate(
        {
            user: receiver,
            actionMaker,
            type: "started following you",
        },
        {
            $set: { createdAt: new Date() },
            $setOnInsert: {
                user: receiver,
                actionMaker,
                type: "started following you",
            },
        },
        { upsert: true, new: true }
    );

    await attachNotificationToUser(receiver, notification._id);
};

export const removeFollowNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);

    const notification = await Notification.findOneAndDelete({
        user: receiver,
        actionMaker,
        type: "started following you",
    });

    if (notification) {
        await detachNotificationFromUser(receiver, notification._id);
    }
};

export const createCommentNotification = async (
    receiverId: mongoose.Types.ObjectId | string,
    actionMakerId: mongoose.Types.ObjectId | string,
    postId: mongoose.Types.ObjectId | string,
    commentId: mongoose.Types.ObjectId | string
) => {
    const receiver = toObjectId(receiverId);
    const actionMaker = toObjectId(actionMakerId);
    const post = toObjectId(postId);
    const comment = toObjectId(commentId);

    if (receiver.equals(actionMaker)) return;

    const notification = await Notification.findOneAndUpdate(
        {
            user: receiver,
            actionMaker,
            comment,
            type: "commented on your post",
        },
        {
            $set: { createdAt: new Date(), post },
            $setOnInsert: {
                user: receiver,
                actionMaker,
                post,
                comment,
                type: "commented on your post",
            },
        },
        { upsert: true, new: true }
    );

    await attachNotificationToUser(receiver, notification._id);
};

type PopulatedNotification = {
    _id: mongoose.Types.ObjectId;
    type: string;
    createdAt?: Date;
    actionMaker?: { _id?: mongoose.Types.ObjectId };
    post?: { _id?: mongoose.Types.ObjectId };
    comment?: { _id?: mongoose.Types.ObjectId };
};

export const dedupeNotificationsForDisplay = <T extends PopulatedNotification>(
    notifications: T[],
    limit = 10
): T[] => {
    const byKey = new Map<string, T>();

    for (const notification of notifications) {
        const actionMakerId = String(notification.actionMaker?._id ?? "");
        const postId = String(notification.post?._id ?? "");
        const commentId = String(notification.comment?._id ?? "");
        const key = `${notification.type}|${actionMakerId}|${postId}|${commentId}`;

        const existing = byKey.get(key);
        if (!existing) {
            byKey.set(key, notification);
            continue;
        }

        const existingTime = new Date(existing.createdAt ?? 0).getTime();
        const currentTime = new Date(notification.createdAt ?? 0).getTime();
        if (currentTime > existingTime) {
            byKey.set(key, notification);
        }
    }

    return Array.from(byKey.values())
        .sort(
            (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
        )
        .slice(0, limit);
};
