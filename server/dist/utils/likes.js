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
exports.syncPostLikeOnDocument = exports.attachIsLikedToPost = exports.attachIsLikedToPosts = exports.reconcileCommentLikes = exports.reconcilePostsLikes = exports.reconcilePostLikes = void 0;
const Like_1 = __importDefault(require("../db/models/Like"));
const likeQueries_1 = require("./likeQueries");
const toPlainObject = (doc) => {
    if (doc &&
        typeof doc === "object" &&
        "toObject" in doc &&
        typeof doc.toObject === "function") {
        return doc.toObject();
    }
    return doc;
};
const postLikeFilter = (postId) => ({
    $or: [{ postId }, { post: postId }],
});
const commentLikeFilter = (commentId) => ({
    $or: [{ commentId }, { comment: commentId }],
});
const uniqueLikeIds = (likeDocs) => {
    const seen = new Set();
    const ids = [];
    for (const doc of likeDocs) {
        const key = doc._id.toString();
        if (!seen.has(key)) {
            seen.add(key);
            ids.push(doc._id);
        }
    }
    return ids;
};
const likesArrayKey = (ids) => [...(ids !== null && ids !== void 0 ? ids : [])].map((id) => id.toString()).sort().join(",");
/** Sync post.likes / like_count with the Like collection (one row per user per post). */
const reconcilePostLikes = (post) => __awaiter(void 0, void 0, void 0, function* () {
    const likeDocs = yield Like_1.default.find(postLikeFilter(post._id)).select("_id").lean();
    const uniqueIds = uniqueLikeIds(likeDocs);
    if (likesArrayKey(post.likes) !== likesArrayKey(uniqueIds) ||
        post.like_count !== uniqueIds.length) {
        post.likes = uniqueIds;
        post.like_count = uniqueIds.length;
        if (typeof post.save === "function") {
            yield post.save();
        }
    }
});
exports.reconcilePostLikes = reconcilePostLikes;
const reconcilePostsLikes = (posts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (posts.length === 0)
        return;
    const postIds = posts.map((post) => post._id);
    const likeDocs = yield Like_1.default.find({
        $or: [
            { postId: { $in: postIds } },
            { post: { $in: postIds } },
        ],
    })
        .select("_id postId post")
        .lean();
    const likesByPost = new Map();
    for (const like of likeDocs) {
        const legacyPost = like.post;
        const postId = (_b = ((_a = like.postId) !== null && _a !== void 0 ? _a : legacyPost)) === null || _b === void 0 ? void 0 : _b.toString();
        if (!postId)
            continue;
        const list = (_c = likesByPost.get(postId)) !== null && _c !== void 0 ? _c : [];
        const idStr = like._id.toString();
        if (!list.some((id) => id.toString() === idStr)) {
            list.push(like._id);
        }
        likesByPost.set(postId, list);
    }
    yield Promise.all(posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const uniqueIds = (_a = likesByPost.get(post._id.toString())) !== null && _a !== void 0 ? _a : [];
        if (likesArrayKey(post.likes) !== likesArrayKey(uniqueIds) ||
            post.like_count !== uniqueIds.length) {
            post.likes = uniqueIds;
            post.like_count = uniqueIds.length;
            if (typeof post.save === "function") {
                yield post.save();
            }
        }
    })));
});
exports.reconcilePostsLikes = reconcilePostsLikes;
const reconcileCommentLikes = (comment) => __awaiter(void 0, void 0, void 0, function* () {
    const likeDocs = yield Like_1.default.find(commentLikeFilter(comment._id)).select("_id").lean();
    const uniqueIds = uniqueLikeIds(likeDocs);
    if (likesArrayKey(comment.likes) !== likesArrayKey(uniqueIds) ||
        comment.like_count !== uniqueIds.length) {
        comment.likes = uniqueIds;
        comment.like_count = uniqueIds.length;
        yield comment.save();
    }
});
exports.reconcileCommentLikes = reconcileCommentLikes;
const attachIsLikedToPosts = (posts, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || posts.length === 0) {
        return posts.map((post) => (Object.assign(Object.assign({}, toPlainObject(post)), { isLiked: false })));
    }
    const postIds = posts.map((post) => post._id);
    const userLikes = yield (0, likeQueries_1.findUserPostLikes)(userId, postIds).lean();
    const likedPostIds = (0, likeQueries_1.likedPostIdsFromLikes)(userLikes);
    return posts.map((post) => (Object.assign(Object.assign({}, toPlainObject(post)), { isLiked: likedPostIds.has(post._id.toString()) })));
});
exports.attachIsLikedToPosts = attachIsLikedToPosts;
const attachIsLikedToPost = (post, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [withLike] = yield (0, exports.attachIsLikedToPosts)([post], userId);
    return withLike;
});
exports.attachIsLikedToPost = attachIsLikedToPost;
const syncPostLikeOnDocument = (post, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const alreadyLinked = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === likeId.toString());
    if (!alreadyLinked) {
        post.likes = (_b = post.likes) !== null && _b !== void 0 ? _b : [];
        post.likes.push(likeId);
    }
    yield (0, exports.reconcilePostLikes)(post);
});
exports.syncPostLikeOnDocument = syncPostLikeOnDocument;
