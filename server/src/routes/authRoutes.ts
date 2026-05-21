// authRoutes.ts
import express, { Router } from 'express';
import 'dotenv/config';
import { loginUser, registerUser, resetPassword, checkAccessToken, logoutUser } from "../controllers/authController";
import ifAuthenticated from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post('/login', loginUser);
router.post("/register", registerUser);
router.post("/reset", resetPassword);
router.get('/check-access-token', ifAuthenticated, checkAccessToken); // Consider removing this
router.post("/logout", logoutUser);

export default router;