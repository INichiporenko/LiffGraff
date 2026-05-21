import {Request, Response, NextFunction} from "express";
import Post from "../db/models/Post";
import mongoose from "mongoose";

const ifPostAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }

        if (!req.user || !(new mongoose.Types.ObjectId(req.user.id).equals(post.author))) {
            res.status(401).send('User is not authorized');
            return;
        }

        (req as any).post = post;
        next();
    } catch (error) {
        res.status(401).send('User is not authorized');
        return;
    }
};

export default ifPostAuthor;