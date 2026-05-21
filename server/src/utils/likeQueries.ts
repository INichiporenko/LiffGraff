import mongoose from "mongoose";
import Like from "../db/models/Like";

export const findPostLike = (
    userId: string,
    postId: mongoose.Types.ObjectId | string
) =>
    Like.findOne({
        $or: [
            { userId, postId },
            { user: userId, post: postId },
        ],
    });

export const findCommentLike = (
    userId: string,
    commentId: mongoose.Types.ObjectId | string
) =>
    Like.findOne({
        $or: [
            { userId, commentId },
            { user: userId, comment: commentId },
        ],
    });

export const createPostLike = (
    userId: string,
    postId: mongoose.Types.ObjectId | string
) =>
    Like.create({
        userId,
        postId,
    });

export const createCommentLike = (
    userId: string,
    commentId: mongoose.Types.ObjectId | string
) =>
    Like.create({
        userId,
        commentId,
    });

export const findUserPostLikes = (
    userId: string,
    postIds: (mongoose.Types.ObjectId | string)[]
) =>
    Like.find({
        $or: [
            { userId, postId: { $in: postIds, $exists: true, $ne: null } },
            { user: userId, post: { $in: postIds, $exists: true, $ne: null } },
        ],
    }).select("postId post");

export const isDuplicateKeyError = (error: unknown): boolean =>
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: number }).code === 11000;

export const likedPostIdsFromLikes = (
    userLikes: {
        postId?: mongoose.Types.ObjectId | null;
        post?: mongoose.Types.ObjectId | null;
    }[]
): Set<string> => {
    const ids = new Set<string>();
    for (const like of userLikes) {
        if (like.postId) ids.add(like.postId.toString());
        if (like.post) ids.add(like.post.toString());
    }
    return ids;
};
