import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: undefined,
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: undefined,
        },
    },
    { minimize: true }
);

// Partial indexes: only post likes / comment likes are indexed (null fields are ignored).
LikeSchema.index(
    { postId: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: { postId: { $exists: true, $type: "objectId" } },
    }
);
LikeSchema.index(
    { commentId: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: { commentId: { $exists: true, $type: "objectId" } },
    }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
