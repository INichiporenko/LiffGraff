import mongoose from "mongoose";
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
type Savable = {
    save: () => Promise<unknown>;
};
/** Sync post.likes / like_count with the Like collection (one row per user per post). */
export declare const reconcilePostLikes: (post: PostLikeTarget & Savable) => Promise<void>;
export declare const reconcilePostsLikes: (posts: (PostLikeTarget & Savable)[]) => Promise<void>;
export declare const reconcileCommentLikes: (comment: CommentLikeTarget & Savable) => Promise<void>;
export declare const attachIsLikedToPosts: <T extends PostLikeTarget>(posts: T[], userId?: string) => Promise<(T & {
    isLiked: boolean;
})[]>;
export declare const attachIsLikedToPost: <T extends PostLikeTarget>(post: T, userId?: string) => Promise<T & {
    isLiked: boolean;
}>;
export declare const syncPostLikeOnDocument: (post: PostLikeTarget & Savable, likeId: mongoose.Types.ObjectId) => Promise<void>;
export {};
