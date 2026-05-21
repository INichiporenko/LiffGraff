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
exports.deleteComment = exports.unLikeComment = exports.likeComment = exports.addCommentToPost = void 0;
const Post_1 = __importDefault(require("../db/models/Post"));
const Comment_1 = __importDefault(require("../db/models/Comment"));
const Like_1 = __importDefault(require("../db/models/Like"));
const likeQueries_1 = require("../utils/likeQueries");
const likes_1 = require("../utils/likes");
const User_1 = __importDefault(require("../db/models/User"));
const notifications_1 = require("../utils/notifications");
const addCommentToPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { postId } = req.params;
        if (!postId) {
            res.status(400).send('Id must be provided');
            return;
        }
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            res.status(404).send('Post now found');
            return;
        }
        const { content } = req.body;
        const trimmedContent = typeof content === "string" ? content.trim() : "";
        if (!trimmedContent) {
            res.status(400).send('Content is required');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const newComment = yield Comment_1.default.create({
            post: postId,
            author: req.user.id,
            content: trimmedContent,
        });
        post.comments.push(newComment._id);
        yield post.save();
        try {
            if (post.author) {
                yield (0, notifications_1.createCommentNotification)(post.author, req.user.id, postId, newComment._id);
            }
        }
        catch (notificationError) {
            console.error('Error creating comment notification:', notificationError);
        }
        const populatedComment = yield Comment_1.default.findById(newComment._id)
            .populate({
            path: "author",
            select: "profile_image username",
        })
            .lean();
        if (!populatedComment) {
            res.status(500).send('Error uploading comment');
            return;
        }
        res.status(201).json(Object.assign(Object.assign({}, populatedComment), { like_count: (_a = populatedComment.like_count) !== null && _a !== void 0 ? _a : 0, likes: (_b = populatedComment.likes) !== null && _b !== void 0 ? _b : [] }));
    }
    catch (error) {
        console.error('Error uploading comment: ', error);
        res.status(500).send('Error uploading comment');
    }
});
exports.addCommentToPost = addCommentToPost;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).send('Id must be provided');
            return;
        }
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            res.status(404).send('Post now found');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const existingLike = yield (0, likeQueries_1.findCommentLike)(req.user.id, comment._id);
        if (existingLike) {
            yield (0, likes_1.reconcileCommentLikes)(comment);
            res.status(200).json({
                like: { _id: existingLike._id, user: req.user.id },
                like_count: comment.like_count,
                isLiked: true,
            });
            return;
        }
        let newLike;
        try {
            newLike = yield (0, likeQueries_1.createCommentLike)(req.user.id, comment._id);
        }
        catch (createError) {
            if ((0, likeQueries_1.isDuplicateKeyError)(createError)) {
                const duplicate = yield (0, likeQueries_1.findCommentLike)(req.user.id, comment._id);
                if (duplicate) {
                    yield (0, likes_1.reconcileCommentLikes)(comment);
                    res.status(200).json({
                        like: { _id: duplicate._id, user: req.user.id },
                        like_count: comment.like_count,
                        isLiked: true,
                    });
                    return;
                }
            }
            throw createError;
        }
        const receiver = yield User_1.default.findById(comment.author);
        if (!receiver) {
            res.status(404).send('User is not found');
            return;
        }
        comment.likes = (_a = comment.likes) !== null && _a !== void 0 ? _a : [];
        comment.likes.push(newLike._id);
        yield (0, likes_1.reconcileCommentLikes)(comment);
        if (comment.author) {
            yield (0, notifications_1.upsertCommentLikeNotification)(comment.author, req.user.id, comment._id);
        }
        res.status(201).json({
            like: { _id: newLike._id, user: req.user.id },
            like_count: comment.like_count,
            isLiked: true,
        });
    }
    catch (error) {
        console.error('Error adding like to a comment: ', error);
        res.status(500).send('Error adding like to a comment');
    }
});
exports.likeComment = likeComment;
const unLikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            res.status(404).send('Post now found');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const like = yield (0, likeQueries_1.findCommentLike)(req.user.id, comment._id);
        if (!like) {
            res.status(404).send('Like not found');
            return;
        }
        yield Like_1.default.deleteOne({ _id: like._id });
        yield (0, likes_1.reconcileCommentLikes)(comment);
        try {
            if (comment.author) {
                yield (0, notifications_1.removeCommentLikeNotification)(comment.author, req.user.id, comment._id);
            }
        }
        catch (notificationError) {
            console.error('Error removing comment like notification:', notificationError);
        }
        res.status(200).json({
            like_count: comment.like_count,
            isLiked: false,
        });
    }
    catch (error) {
        console.error('Error unliking a comment: ', error);
        res.status(500).send('Error unliking a comment');
    }
});
exports.unLikeComment = unLikeComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).send('Id must be provided');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }
        const post = yield Post_1.default.findById(comment.post);
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        const userId = req.user.id;
        if (!comment.author || !post.author) {
            res.status(500).send('Comment or post data is invalid');
            return;
        }
        const isCommentAuthor = comment.author.toString() === userId;
        const isPostOwner = post.author.toString() === userId;
        if (!isCommentAuthor && !isPostOwner) {
            res.status(403).send('You cannot delete this comment');
            return;
        }
        yield Like_1.default.deleteMany({
            $or: [{ commentId: comment._id }, { comment: comment._id }],
        });
        post.comments = post.comments.filter((id) => id.toString() !== comment._id.toString());
        yield post.save();
        yield Comment_1.default.deleteOne({ _id: comment._id });
        res.status(200).json({ commentId: comment._id, postId: post._id.toString() });
    }
    catch (error) {
        console.error('Error deleting comment: ', error);
        res.status(500).send('Error deleting comment');
    }
});
exports.deleteComment = deleteComment;
