"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const userController_1 = require("../controllers/userController");
const followMiddleware_1 = require("../middlewares/followMiddleware");
const router = express_1.default.Router();
router.get('/:username', authMiddleware_1.default, userController_1.getUserByUsername);
router.get('/', authMiddleware_1.default, userController_1.searchUsers);
router.post('/:username/follow', authMiddleware_1.default, followMiddleware_1.ifFollowed, userController_1.followUser);
router.delete('/:username/unfollow', authMiddleware_1.default, followMiddleware_1.ifFollowed, userController_1.unfollowUser);
router.post('/:username/edit', authMiddleware_1.default, uploadImage_1.default.single('photo'), userController_1.updateProfile);
router.post('/add_to_search_results', authMiddleware_1.default, userController_1.addUserToSearchResults);
exports.default = router;
