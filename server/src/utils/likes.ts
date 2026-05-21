import mongoose from "mongoose";
import Like from "../db/models/Like";
import { findUserPostLikes, likedPostIdsFromLikes } from "./likeQueries";

type PostLikeTarget = {
    _id: mongoose.Types.ObjectId | string;
    likes?: mongoose.Types.ObjectId[];
    like_count?: number;
};

type CommentLikeTarget = {
    _id: mongoose.Types.ObjectId | string;
    likes?: mongoose.Types.ObjectId[];
    like_count?: number;
};

type Savable = { save: () => Promise<unknown> };

const toPlainObject = <T>(doc: T): T => {
    if (
        doc &&
        typeof doc === "object" &&
        "toObject" in doc &&
        typeof (doc as { toObject?: () => T }).toObject === "function"
    ) {
        return (doc as { toObject: () => T }).toObject();
    }
    return doc;
};

const postLikeFilter = (postId: mongoose.Types.ObjectId | string) => ({
    $or: [{ postId }, { post: postId }],
});

const commentLikeFilter = (commentId: mongoose.Types.ObjectId | string) => ({
    $or: [{ commentId }, { comment: commentId }],
});

const uniqueLikeIds = (
    likeDocs: { _id: mongoose.Types.ObjectId }[]
): mongoose.Types.ObjectId[] => {
    const seen = new Set<string>();
    const ids: mongoose.Types.ObjectId[] = [];
    for (const doc of likeDocs) {
        const key = doc._id.toString();
        if (!seen.has(key)) {
            seen.add(key);
            ids.push(doc._id);
        }
    }
    return ids;
};

const likesArrayKey = (ids: mongoose.Types.ObjectId[] | undefined): string =>
    [...(ids ?? [])].map((id) => id.toString()).sort().join(",");

/** Sync post.likes / like_count with the Like collection (one row per user per post). */
export const reconcilePostLikes = async (
    post: PostLikeTarget & Savable
): Promise<void> => {
    const likeDocs = await Like.find(postLikeFilter(post._id)).select("_id").lean();
    const uniqueIds = uniqueLikeIds(likeDocs);

    if (
        likesArrayKey(post.likes) !== likesArrayKey(uniqueIds) ||
        post.like_count !== uniqueIds.length
    ) {
        post.likes = uniqueIds;
        post.like_count = uniqueIds.length;
        if (typeof post.save === "function") {
            await post.save();
        }
    }
};

export const reconcilePostsLikes = async (
    posts: (PostLikeTarget & Savable)[]
): Promise<void> => {
    if (posts.length === 0) return;

    const postIds = posts.map((post) => post._id);
    const likeDocs = await Like.find({
        $or: [
            { postId: { $in: postIds } },
            { post: { $in: postIds } },
        ],
    })
        .select("_id postId post")
        .lean();

    const likesByPost = new Map<string, mongoose.Types.ObjectId[]>();

    for (const like of likeDocs) {
        const legacyPost = (like as { post?: mongoose.Types.ObjectId }).post;
        const postId = (like.postId ?? legacyPost)?.toString();
        if (!postId) continue;
        const list = likesByPost.get(postId) ?? [];
        const idStr = like._id.toString();
        if (!list.some((id) => id.toString() === idStr)) {
            list.push(like._id);
        }
        likesByPost.set(postId, list);
    }

    await Promise.all(
        posts.map(async (post) => {
            const uniqueIds = likesByPost.get(post._id.toString()) ?? [];
            if (
                likesArrayKey(post.likes) !== likesArrayKey(uniqueIds) ||
                post.like_count !== uniqueIds.length
            ) {
                post.likes = uniqueIds;
                post.like_count = uniqueIds.length;
                if (typeof post.save === "function") {
                    await post.save();
                }
            }
        })
    );
};

export const reconcileCommentLikes = async (
    comment: CommentLikeTarget & Savable
): Promise<void> => {
    const likeDocs = await Like.find(commentLikeFilter(comment._id)).select("_id").lean();
    const uniqueIds = uniqueLikeIds(likeDocs);

    if (
        likesArrayKey(comment.likes) !== likesArrayKey(uniqueIds) ||
        comment.like_count !== uniqueIds.length
    ) {
        comment.likes = uniqueIds;
        comment.like_count = uniqueIds.length;
        await comment.save();
    }
};

export const attachIsLikedToPosts = async <T extends PostLikeTarget>(
    posts: T[],
    userId?: string
): Promise<(T & { isLiked: boolean })[]> => {
    if (!userId || posts.length === 0) {
        return posts.map((post) => ({ ...toPlainObject(post), isLiked: false }));
    }

    const postIds = posts.map((post) => post._id);
    const userLikes = await findUserPostLikes(userId, postIds).lean();
    const likedPostIds = likedPostIdsFromLikes(userLikes);

    return posts.map((post) => ({
        ...toPlainObject(post),
        isLiked: likedPostIds.has(post._id.toString()),
    }));
};

export const attachIsLikedToPost = async <T extends PostLikeTarget>(
    post: T,
    userId?: string
): Promise<T & { isLiked: boolean }> => {
    const [withLike] = await attachIsLikedToPosts([post], userId);
    return withLike;
};

export const syncPostLikeOnDocument = async (
    post: PostLikeTarget & Savable,
    likeId: mongoose.Types.ObjectId
): Promise<void> => {
    const alreadyLinked = post.likes?.some(
        (id) => id.toString() === likeId.toString()
    );

    if (!alreadyLinked) {
        post.likes = post.likes ?? [];
        post.likes.push(likeId);
    }
    await reconcilePostLikes(post);
};
