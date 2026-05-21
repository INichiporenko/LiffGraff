import express from 'express';
import ifAuthenticated from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadImage";
import {
    addUserToSearchResults,
    followUser,
    getUserByUsername,
    searchUsers,
    unfollowUser,
    updateProfile
} from "../controllers/userController";
import {ifFollowed} from "../middlewares/followMiddleware";

const router = express.Router();

router.get('/:username', ifAuthenticated, getUserByUsername);
router.get('/', ifAuthenticated, searchUsers);
router.post('/:username/follow', ifAuthenticated, ifFollowed, followUser);
router.delete('/:username/unfollow', ifAuthenticated, ifFollowed, unfollowUser);
router.post('/:username/edit', ifAuthenticated, upload.single('photo'), updateProfile);
router.post('/add_to_search_results', ifAuthenticated, addUserToSearchResults);

export default router;