"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
router.post('/:postId/add', authMiddleware_1.default, commentController_1.addCommentToPost);
router.post('/:commentId/like', authMiddleware_1.default, commentController_1.likeComment);
router.delete('/:commentId/unlike', authMiddleware_1.default, commentController_1.unLikeComment);
router.delete('/:commentId', authMiddleware_1.default, commentController_1.deleteComment);
exports.default = router;
