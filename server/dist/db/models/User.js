"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "", maxlength: 180 },
    website: { type: String, maxlength: 120 },
    profile_image: { type: String, default: 'https://res.cloudinary.com/dkmunyorn/image/upload/v1737282562/profiles/cxjlx87qkz06ucag1ny4.png' },
    notifications: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Notification" }],
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    search_results: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
