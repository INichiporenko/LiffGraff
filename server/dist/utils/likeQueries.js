"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likedPostIdsFromLikes = exports.isDuplicateKeyError = exports.findUserPostLikes = exports.createCommentLike = exports.createPostLike = exports.findCommentLike = exports.findPostLike = void 0;
const Like_1 = __importDefault(require("../db/models/Like"));
const findPostLike = (userId, postId) => Like_1.default.findOne({
    $or: [
        { userId, postId },
        { user: userId, post: postId },
    ],
});
exports.findPostLike = findPostLike;
const findCommentLike = (userId, commentId) => Like_1.default.findOne({
    $or: [
        { userId, commentId },
        { user: userId, comment: commentId },
    ],
});
exports.findCommentLike = findCommentLike;
const createPostLike = (userId, postId) => Like_1.default.create({
    userId,
    postId,
});
exports.createPostLike = createPostLike;
const createCommentLike = (userId, commentId) => Like_1.default.create({
    userId,
    commentId,
});
exports.createCommentLike = createCommentLike;
const findUserPostLikes = (userId, postIds) => Like_1.default.find({
    $or: [
        { userId, postId: { $in: postIds, $exists: true, $ne: null } },
        { user: userId, post: { $in: postIds, $exists: true, $ne: null } },
    ],
}).select("postId post");
exports.findUserPostLikes = findUserPostLikes;
const isDuplicateKeyError = (error) => error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000;
exports.isDuplicateKeyError = isDuplicateKeyError;
const likedPostIdsFromLikes = (userLikes) => {
    const ids = new Set();
    for (const like of userLikes) {
        if (like.postId)
            ids.add(like.postId.toString());
        if (like.post)
            ids.add(like.post.toString());
    }
    return ids;
};
exports.likedPostIdsFromLikes = likedPostIdsFromLikes;
