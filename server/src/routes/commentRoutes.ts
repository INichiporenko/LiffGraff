import { Router } from 'express';
import ifAuthenticated from "../middlewares/authMiddleware";
import {addCommentToPost, deleteComment, likeComment, unLikeComment} from "../controllers/commentController";
const router: Router = Router();

router.post('/:postId/add', ifAuthenticated, addCommentToPost);
router.post('/:commentId/like', ifAuthenticated, likeComment);
router.delete('/:commentId/unlike', ifAuthenticated, unLikeComment);
router.delete('/:commentId', ifAuthenticated, deleteComment);

export default router;