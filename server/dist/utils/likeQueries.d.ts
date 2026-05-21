import mongoose from "mongoose";
export declare const findPostLike: (userId: string, postId: mongoose.Types.ObjectId | string) => mongoose.Query<(mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | null, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}, "findOne", {}>;
export declare const findCommentLike: (userId: string, commentId: mongoose.Types.ObjectId | string) => mongoose.Query<(mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | null, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}, "findOne", {}>;
export declare const createPostLike: (userId: string, postId: mongoose.Types.ObjectId | string) => Promise<mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const createCommentLike: (userId: string, commentId: mongoose.Types.ObjectId | string) => Promise<mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const findUserPostLikes: (userId: string, postIds: (mongoose.Types.ObjectId | string)[]) => mongoose.Query<(mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
})[], mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}> & {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, {}, {
    userId: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId | null | undefined;
    commentId?: mongoose.Types.ObjectId | null | undefined;
}, "find", {}>;
export declare const isDuplicateKeyError: (error: unknown) => boolean;
export declare const likedPostIdsFromLikes: (userLikes: {
    postId?: mongoose.Types.ObjectId | null;
    post?: mongoose.Types.ObjectId | null;
}[]) => Set<string>;
