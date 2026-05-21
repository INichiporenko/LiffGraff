"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// authRoutes.ts
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/login', authController_1.loginUser);
router.post("/register", authController_1.registerUser);
router.post("/reset", authController_1.resetPassword);
router.get('/check-access-token', authMiddleware_1.default, authController_1.checkAccessToken); // Consider removing this
router.post("/logout", authController_1.logoutUser);
exports.default = router;
