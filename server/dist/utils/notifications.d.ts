import mongoose from "mongoose";
export declare const upsertPostLikeNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string, postId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const removePostLikeNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string, postId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const upsertCommentLikeNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string, commentId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const removeCommentLikeNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string, commentId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const upsertFollowNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const removeFollowNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string) => Promise<void>;
export declare const createCommentNotification: (receiverId: mongoose.Types.ObjectId | string, actionMakerId: mongoose.Types.ObjectId | string, postId: mongoose.Types.ObjectId | string, commentId: mongoose.Types.ObjectId | string) => Promise<void>;
type PopulatedNotification = {
    _id: mongoose.Types.ObjectId;
    type: string;
    createdAt?: Date;
    actionMaker?: {
        _id?: mongoose.Types.ObjectId;
    };
    post?: {
        _id?: mongoose.Types.ObjectId;
    };
    comment?: {
        _id?: mongoose.Types.ObjectId;
    };
};
export declare const dedupeNotificationsForDisplay: <T extends PopulatedNotification>(notifications: T[], limit?: number) => T[];
export {};
