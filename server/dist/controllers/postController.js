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
exports.getFollowedPosts = exports.updatePost = exports.deletePost = exports.unLikePost = exports.likePost = exports.getRandomPosts = exports.getPostById = exports.createPost = void 0;
const User_1 = __importDefault(require("../db/models/User"));
const Post_1 = __importDefault(require("../db/models/Post"));
const multer_1 = __importDefault(require("multer"));
const Like_1 = __importDefault(require("../db/models/Like"));
const likes_1 = require("../utils/likes");
const likeQueries_1 = require("../utils/likeQueries");
const notifications_1 = require("../utils/notifications");
const Photo_1 = __importDefault(require("../db/models/Photo"));
const cloudinary_1 = require("../config/cloudinary");
const sharp_1 = __importDefault(require("sharp"));
// Create a post with Cloudinary photo uploads
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        // Validate request data
        if (!content) {
            res.status(400).send('Content is required');
            return;
        }
        if (!req.user) {
            res.status(401).send('User not authenticated');
            return;
        }
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded');
            return;
        }
        const uploadedPhotos = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Get image metadata
                const { width, height } = yield (0, sharp_1.default)(file.buffer).metadata();
                if (!width || !height)
                    return;
                let transformation = {}; // Default to no transformation
                // Determine aspect ratio
                if (width / height >= 1.5) {
                    // Width is much larger -> Apply 16:9
                    transformation = { aspect_ratio: "16:9", crop: "fill", gravity: "auto" };
                }
                else if (height / width >= 1.5) {
                    // Height is much larger -> Apply 3:4
                    transformation = { aspect_ratio: "3:4", crop: "fill", gravity: "auto" };
                }
                return new Promise((resolve, reject) => {
                    cloudinary_1.cloudinary.uploader.upload_stream({
                        folder: "posts",
                        transformation: [transformation], // Apply transformation only if necessary
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            if (!result)
                                return;
                            resolve(result.secure_url); // Return uploaded URL
                        }
                    }).end(file.buffer); // Upload the buffer data
                });
            }
            catch (error) {
                console.error("Image processing error:", error);
                return null;
            }
        })));
        // Save uploaded photo URLs to the `Photo` collection
        const photoDocuments = yield Promise.all(uploadedPhotos.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            const photo = new Photo_1.default({
                url: url,
                post: null, // Assign post ID after creating the post
            });
            yield photo.save();
            return photo._id; // Return the ID for linking with the post
        })));
        // Create the post with linked photo IDs
        const post = yield Post_1.default.create({
            photos: photoDocuments, // Array of photo ObjectIds
            content,
            author: user._id,
        });
        // Update the `post` field in each `Photo` document
        yield Promise.all(photoDocuments.map((photoId) => __awaiter(void 0, void 0, void 0, function* () {
            yield Photo_1.default.findByIdAndUpdate(photoId, { post: post._id });
        })));
        // Add the post to the user's list of posts
        user.posts.push(post._id);
        yield user.save();
        // Populate photos before sending the response
        yield post.populate('photos', 'url');
        res.status(201).send(post);
    }
    catch (error) {
        console.error('Error creating post: ', error);
        if (error instanceof multer_1.default.MulterError) {
            res.status(400).send(error.message); // Handle Multer errors
        }
        else {
            res.status(500).send('Error creating post');
        }
    }
});
exports.createPost = createPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.params;
        if (!postId) {
            res.status(404).send('Id must be provided');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const post = yield Post_1.default.findById(postId).populate({
            path: 'author', // Populate the author field
            select: 'profile_image username followers', // Include only photo and followers fields
        }).populate({ path: 'likes', select: 'userId' })
            .populate({
            path: 'comments',
            populate: [
                {
                    path: 'author',
                    select: 'profile_image username',
                },
                {
                    path: 'likes',
                    select: 'userId',
                }
            ]
        }).populate('photos', 'url');
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        yield (0, likes_1.reconcilePostLikes)(post);
        if ((_a = post.comments) === null || _a === void 0 ? void 0 : _a.length) {
            yield Promise.all(post.comments
                .filter((comment) => typeof comment === "object" &&
                comment !== null &&
                "save" in comment &&
                typeof comment.save === "function")
                .map((comment) => (0, likes_1.reconcileCommentLikes)(comment)));
        }
        const postWithLikeStatus = yield (0, likes_1.attachIsLikedToPost)(post, req.user.id);
        res.status(200).json(postWithLikeStatus);
    }
    catch (error) {
        console.error('Error getting post by id: ', error);
        res.status(500).send('Error getting post by id');
    }
});
exports.getPostById = getPostById;
const getRandomPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const countNumber = Math.min(Math.max(Number(req.query.count) || 10, 1), 50);
        const total = yield Post_1.default.countDocuments();
        if (total === 0) {
            res.status(200).json([]);
            return;
        }
        const sampleSize = Math.min(countNumber, total);
        const sampled = yield Post_1.default.aggregate([{ $sample: { size: sampleSize } }]);
        const ids = sampled.map((post) => post._id);
        const populatedPosts = yield Post_1.default.find({ _id: { $in: ids } })
            .populate("author", "username profile_image")
            .populate("photos", "url")
            .populate("likes", "userId");
        yield (0, likes_1.reconcilePostsLikes)(populatedPosts);
        const postsWithLikeStatus = yield (0, likes_1.attachIsLikedToPosts)(populatedPosts, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        res.status(200).json(postsWithLikeStatus);
    }
    catch (error) {
        console.error('Error getting posts: ', error);
        res.status(500).send('Error getting posts');
    }
});
exports.getRandomPosts = getRandomPosts;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        if (!postId) {
            res.status(400).send('Id must be provided');
            return;
        }
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        if (!req.user) {
            res.status(401).send('User is not authorized');
            return;
        }
        const existingLike = yield (0, likeQueries_1.findPostLike)(req.user.id, post._id);
        if (existingLike) {
            yield (0, likes_1.syncPostLikeOnDocument)(post, existingLike._id);
            res.status(200).json({
                like: { _id: existingLike._id, user: req.user.id },
                like_count: post.like_count,
                isLiked: true,
            });
            return;
        }
        let newLike;
        try {
            newLike = yield (0, likeQueries_1.createPostLike)(req.user.id, post._id);
        }
        catch (createError) {
            if ((0, likeQueries_1.isDuplicateKeyError)(createError)) {
                const duplicate = yield (0, likeQueries_1.findPostLike)(req.user.id, post._id);
                if (duplicate) {
                    yield (0, likes_1.syncPostLikeOnDocument)(post, duplicate._id);
                    res.status(200).json({
                        like: { _id: duplicate._id, user: req.user.id },
                        like_count: post.like_count,
                        isLiked: true,
                    });
                    return;
                }
            }
            throw createError;
        }
        yield (0, likes_1.syncPostLikeOnDocument)(post, newLike._id);
        try {
            if (post.author) {
                yield (0, notifications_1.upsertPostLikeNotification)(post.author, req.user.id, postId);
            }
        }
        catch (notificationError) {
            console.error('Error creating like notification:', notificationError);
        }
        res.status(201).json({
            like: { _id: newLike._id, user: req.user.id },
            like_count: post.like_count,
            isLiked: true,
        });
    }
    catch (error) {
        console.error('Error adding like to a post: ', error);
        res.status(500).send('Error adding like to a post');
    }
});
exports.likePost = likePost;
const unLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = yield Post_1.default.findById(postId);
        if (!post || !req.user) {
            res.status(404).send('Post or user not found');
            return;
        }
        const like = yield (0, likeQueries_1.findPostLike)(req.user.id, post._id);
        if (!like) {
            res.status(404).send('Like not found');
            return;
        }
        yield Like_1.default.deleteOne({ _id: like._id });
        yield (0, likes_1.reconcilePostLikes)(post);
        try {
            if (post.author) {
                yield (0, notifications_1.removePostLikeNotification)(post.author, req.user.id, post._id);
            }
        }
        catch (notificationError) {
            console.error('Error removing like notification:', notificationError);
        }
        res.status(200).json({
            like_count: post.like_count,
            isLiked: false,
        });
    }
    catch (error) {
        console.error('Error unliking a post: ', error);
        res.status(500).send('Error unliking a post');
    }
});
exports.unLikePost = unLikePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = req.post;
        if (!post || !req.user)
            return;
        yield Post_1.default.deleteOne({ _id: post._id });
        res.status(200).send(post);
    }
    catch (error) {
        console.error('Error deleting a post: ', error);
        res.status(500).send('Error deleting a post');
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = req.post;
        if (!post || !req.user)
            return;
        const { content } = req.body;
        if (!content) {
            res.status(401).send('Content be provided');
        }
        post.content = content;
        post.save();
        res.status(200).send(post);
    }
    catch (error) {
        console.error('Error updating a post: ', error);
        res.status(500).send('Error updating a post');
    }
});
exports.updatePost = updatePost;
const getFollowedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(404).send('User is not authorized');
            return;
        }
        const userId = req.user.id; // Assume this is set by authentication middleware
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        // Find the current user's following list
        const user = yield User_1.default.findById(userId).select("followings");
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        // Fetch posts from followed users
        const posts = yield Post_1.default.find({ author: { $in: user.followings } })
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("author", "username profile_image")
            .populate('likes', 'userId')
            .populate('photos', 'url');
        yield (0, likes_1.reconcilePostsLikes)(posts);
        const postsWithLikeStatus = yield (0, likes_1.attachIsLikedToPosts)(posts, req.user.id);
        res.status(200).json(postsWithLikeStatus);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Server error");
    }
});
exports.getFollowedPosts = getFollowedPosts;
