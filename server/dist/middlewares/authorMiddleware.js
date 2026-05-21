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
const Post_1 = __importDefault(require("../db/models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
const ifPostAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        if (!req.user || !(new mongoose_1.default.Types.ObjectId(req.user.id).equals(post.author))) {
            res.status(401).send('User is not authorized');
            return;
        }
        req.post = post;
        next();
    }
    catch (error) {
        res.status(401).send('User is not authorized');
        return;
    }
});
exports.default = ifPostAuthor;
