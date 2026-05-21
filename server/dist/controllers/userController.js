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
exports.addUserToSearchResults = exports.unfollowUser = exports.followUser = exports.updateProfile = exports.searchUsers = exports.getUserByUsername = void 0;
const User_1 = __importDefault(require("../db/models/User"));
const notifications_1 = require("../utils/notifications");
const cloudinary_1 = require("../config/cloudinary");
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username } = req.params;
        if (!req.user)
            return;
        let user;
        if (username === req.user.username) {
            user = yield User_1.default.find({ username }).select('-password')
                .populate({
                path: 'followings',
                select: 'profile_image username _id',
            }).populate({
                path: 'followers',
                select: 'profile_image username _id',
            }).populate({
                path: 'posts',
                populate: [
                    {
                        path: 'photos',
                        select: 'url'
                    },
                    {
                        path: 'likes',
                        select: 'userId'
                    }
                ]
            }).populate({
                path: 'notifications',
                options: { sort: { createdAt: -1 }, limit: 50 },
                populate: [
                    {
                        path: 'post',
                        populate: [
                            {
                                path: 'photos',
                                select: 'url'
                            }
                        ]
                    },
                    {
                        path: 'comment',
                        select: 'author',
                        populate: [
                            {
                                path: 'post',
                                populate: [
                                    {
                                        path: 'photos',
                                        select: 'url'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'actionMaker',
                        select: 'username profile_image',
                    },
                ]
            }).populate('search_results', 'username profile_image');
        }
        else {
            user = yield User_1.default.find({ username }).select('-password')
                .populate({
                path: 'followings',
                select: 'profile_image username _id',
            }).populate({
                path: 'followers',
                select: 'profile_image username _id',
            }).populate({
                path: 'posts',
                populate: [
                    {
                        path: 'photos',
                        select: 'url'
                    },
                    {
                        path: 'likes',
                        select: 'userId'
                    }
                ]
            });
        }
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (Array.isArray(user) && ((_b = (_a = user[0]) === null || _a === void 0 ? void 0 : _a.notifications) === null || _b === void 0 ? void 0 : _b.length)) {
            const profile = user[0];
            profile.notifications = (0, notifications_1.dedupeNotificationsForDisplay)(profile.notifications);
        }
        res.status(200).send(user);
    }
    catch (error) {
        console.error('Error fetching a user: ', error);
        res.status(500).send('Error fetching a user');
    }
});
exports.getUserByUsername = getUserByUsername;
const searchUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, 'username profile_image');
        res.status(200).send(users);
    }
    catch (error) {
        console.error('Error searching users: ', error);
        res.status(500).send('Error searching users');
    }
});
exports.searchUsers = searchUsers;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        // Check if user exists
        const user = yield User_1.default.findOne({ username }).select('-password');
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const { bio, website, new_username } = req.body;
        // Check if new username already exists
        if (new_username && new_username !== username) {
            const newUsernameUser = yield User_1.default.findOne({ username: new_username });
            if (newUsernameUser) {
                res.status(400).json({ message: 'Username already exists' });
                return;
            }
            user.username = new_username;
        }
        // Update bio and website
        if (website !== undefined && website.length <= 120) {
            user.website = website;
        }
        if (bio !== undefined && bio.length <= 150) {
            user.bio = bio;
        }
        // Upload new profile image to Cloudinary (optional)
        const file = req.file;
        if (file) {
            const uploadedImage = yield new Promise((resolve, reject) => {
                cloudinary_1.cloudinary.uploader.upload_stream({
                    folder: 'profiles',
                    public_id: `${user.username}-profile`,
                    overwrite: true,
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else if (result) {
                        resolve(result.secure_url);
                    }
                    else {
                        reject(new Error('Image upload failed'));
                    }
                }).end(file.buffer);
            });
            user.profile_image = uploadedImage;
        }
        const updatedUser = yield user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating a user profile: ', error);
        res.status(500).send('Error updating a user profile');
    }
});
exports.updateProfile = updateProfile;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = req.profile;
        const userProfile = req.userProfile;
        const followed = req.followed;
        if (followed) {
            res.status(404).send('Already followed');
            return;
        }
        profile.followers.push(userProfile._id);
        userProfile.followings.push(profile._id);
        yield (0, notifications_1.upsertFollowNotification)(profile._id, userProfile._id);
        yield profile.save();
        yield userProfile.save();
        res.status(201).send({
            _id: profile._id,
            profile_image: profile.profile_image,
            username: profile.username,
        });
    }
    catch (error) {
        console.error('Error following a user: ', error);
        res.status(500).send('Error following a user');
    }
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = req.profile;
        const userProfile = req.userProfile;
        const followed = req.followed;
        if (!followed) {
            res.status(404).send('Following not found');
            return;
        }
        profile.followers = profile.followers.filter((f) => !f._id.equals(userProfile._id));
        userProfile.followings = userProfile.followings.filter((f) => !f._id.equals(profile._id));
        yield (0, notifications_1.removeFollowNotification)(profile._id, userProfile._id);
        yield profile.save();
        yield userProfile.save();
        res.status(200).send({
            _id: profile._id,
            profile_image: profile.profile_image,
            username: profile.username,
        });
    }
    catch (error) {
        console.error('Error deleting a following: ', error);
        res.status(500).send('Error deleting a following');
    }
});
exports.unfollowUser = unfollowUser;
const addUserToSearchResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username || !req.user) {
            res.status(400).send('Users must be provided');
            return;
        }
        const user = yield User_1.default.findById(req.user.id);
        const searchedUser = yield User_1.default.findOne({ username });
        if (!user || !searchedUser) {
            res.status(404).send('User not found');
            return;
        }
        user.search_results.push(searchedUser._id);
        yield user.save();
        res.status(200).send('User added to search results');
    }
    catch (error) {
        console.error('Error adding user to search results');
        res.status(500).send('Error adding user to search results');
    }
});
exports.addUserToSearchResults = addUserToSearchResults;
