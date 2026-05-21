"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PhotoSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true },
    post: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" },
});
const Photo = mongoose_1.default.model("Photo", PhotoSchema);
exports.default = Photo;
