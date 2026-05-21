import { Router } from 'express';
import ifAuthenticated from "../middlewares/authMiddleware";
import {
    getChatByReceiverUsername,
    getUnreadMessagesCount,
    getUserChats,
} from "../controllers/messageController";

const router: Router = Router();

router.get('/unread_count', ifAuthenticated, getUnreadMessagesCount);
router.post('/get_chat', ifAuthenticated, getChatByReceiverUsername );
router.get('/get_user_chats', ifAuthenticated, getUserChats );

export default router;