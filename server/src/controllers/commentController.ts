import {Request, Response} from "express";
import Post from "../db/models/Post";
import Comment from "../db/models/Comment";
import Like from "../db/models/Like";
import { createCommentLike, findCommentLike, isDuplicateKeyError } from "../utils/likeQueries";
import { reconcileCommentLikes } from "../utils/likes";
import mongoose from "mongoose";
import User from "../db/models/User";
import {
    createCommentNotification,
    removeCommentLikeNotification,
    upsertCommentLikeNotification,
} from "../utils/notifications";

export const addCommentToPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            res.status(400).send('Id must be provided');
            return;
        }
        const post = await Post.findById(postId);
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

        const newComment = await Comment.create({
            post: postId,
            author: req.user.id,
            content: trimmedContent,
        });
        post.comments.push(newComment._id);
        await post.save();

        try {
            if (post.author) {
                await createCommentNotification(
                    post.author,
                    req.user.id,
                    postId,
                    newComment._id
                );
            }
        } catch (notificationError) {
            console.error('Error creating comment notification:', notificationError);
        }

        const populatedComment = await Comment.findById(newComment._id)
            .populate({
                path: "author",
                select: "profile_image username",
            })
            .lean();

        if (!populatedComment) {
            res.status(500).send('Error uploading comment');
            return;
        }

        res.status(201).json({
            ...populatedComment,
            like_count: populatedComment.like_count ?? 0,
            likes: populatedComment.likes ?? [],
        });
    } catch (error) {
        console.error('Error uploading comment: ', error);
        res.status(500).send('Error uploading comment');
    }
};

export const likeComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).send('Id must be provided');
            return;
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).send('Post now found');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }

        const existingLike = await findCommentLike(req.user.id, comment._id);
        if (existingLike) {
            await reconcileCommentLikes(comment);
            res.status(200).json({
                like: { _id: existingLike._id, user: req.user.id },
                like_count: comment.like_count,
                isLiked: true,
            });
            return;
        }

        let newLike;
        try {
            newLike = await createCommentLike(req.user.id, comment._id);
        } catch (createError: unknown) {
            if (isDuplicateKeyError(createError)) {
                const duplicate = await findCommentLike(req.user.id, comment._id);
                if (duplicate) {
                    await reconcileCommentLikes(comment);
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

        const receiver = await User.findById(comment.author);
        if (!receiver) {
            res.status(404).send('User is not found');
            return;
        }

        comment.likes = comment.likes ?? [];
        comment.likes.push(newLike._id);
        await reconcileCommentLikes(comment);
        if (comment.author) {
            await upsertCommentLikeNotification(
                comment.author,
                req.user.id,
                comment._id
            );
        }
        res.status(201).json({
            like: { _id: newLike._id, user: req.user.id },
            like_count: comment.like_count,
            isLiked: true,
        });
    } catch (error) {
        console.error('Error adding like to a comment: ', error);
        res.status(500).send('Error adding like to a comment');
    }
};

export const unLikeComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).send('Post now found');
            return;
        }

        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }

        const like = await findCommentLike(req.user.id, comment._id);
        if (!like) {
            res.status(404).send('Like not found');
            return;
        }

        await Like.deleteOne({ _id: like._id });
        await reconcileCommentLikes(comment);

        try {
            if (comment.author) {
                await removeCommentLikeNotification(
                    comment.author,
                    req.user.id,
                    comment._id
                );
            }
        } catch (notificationError) {
            console.error('Error removing comment like notification:', notificationError);
        }

        res.status(200).json({
            like_count: comment.like_count,
            isLiked: false,
        });
    } catch (error) {
        console.error('Error unliking a comment: ', error);
        res.status(500).send('Error unliking a comment');
    }
};

export const deleteComment = async (req: Request, res: Response) => {
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

        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).send('Comment not found');
            return;
        }

        const post = await Post.findById(comment.post);
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

        await Like.deleteMany({
            $or: [{ commentId: comment._id }, { comment: comment._id }],
        });

        post.comments = post.comments.filter(
            (id: mongoose.Types.ObjectId) => id.toString() !== comment._id.toString()
        );
        await post.save();
        await Comment.deleteOne({ _id: comment._id });

        res.status(200).json({ commentId: comment._id, postId: post._id.toString() });
    } catch (error) {
        console.error('Error deleting comment: ', error);
        res.status(500).send('Error deleting comment');
    }
};