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
exports.logoutUser = exports.checkAccessToken = exports.resetPassword = exports.registerUser = exports.loginUser = void 0;
const User_1 = __importDefault(require("../db/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            res.status(400).send("Username or email and password is required");
            return; // Ensure the function exits after sending a response
        }
        const user = yield User_1.default.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const passwordIsValid = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordIsValid) {
            res.status(401).send("Wrong password or username");
            return;
        }
        if (process.env.JWT_KEY) {
            const info = {
                username: user.username,
                id: user._id.toString(),
            };
            const token = jsonwebtoken_1.default.sign(info, process.env.JWT_KEY, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true, // Prevent access to cookies via JavaScript
                secure: process.env.NODE_ENV === "production", // Use HTTPS in production
                sameSite: "lax", // Or 'strict' if cross-site requests are not needed
                maxAge: 3600 * 1000, // 1 hour in milliseconds
                path: "/",
            });
            res.status(200).json({
                message: "Successfully logged in with token",
                data: {
                    username: user.username,
                    id: user.id,
                    profile_image: user.profile_image,
                },
            });
            return;
        }
        else {
            res.status(500).send("Server configuration error: JWT key not defined");
            return;
        }
    }
    catch (error) {
        console.error("Error during login:", error);
        if (error instanceof Error) {
            res.status(500).send("Error logging in: " + error.message);
        }
        else {
            res.status(500).send("Error logging in: An unexpected error occurred");
        }
    }
});
exports.loginUser = loginUser;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullName, email, password } = req.body;
        if (!username || !password || !email || !fullName) {
            res.status(400).send("Username, email, full name and password are required");
            return; // Ensure the function exits after sending a response
        }
        // Check if user exists
        const existingUser = yield User_1.default.findOne({
            $or: [{ username: username }, { email: email }],
        });
        if (existingUser) {
            res.status(409).send("User with this username or email already exists");
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({
            username,
            full_name: fullName,
            email,
            password: hashedPassword,
        });
        res.status(201).send("Successfully registered!");
    }
    catch (error) {
        console.error("Error registering a user:", error);
        if (error instanceof Error) {
            res.status(500).send("Error registering: " + error.message);
        }
        else {
            res.status(500).send("Error registering: An unexpected error occurred");
        }
    }
});
exports.registerUser = registerUser;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail } = req.body;
        if (!usernameOrEmail) {
            res.status(400).send("Username or email is required");
            return; // Ensure the function exits after sending a response
        }
        // Check if user exists
        const user = yield User_1.default.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        // Generate a reset token
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        yield user.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail", // You can use other services like Outlook, Yahoo, etc.
            auth: {
                user: process.env.EMAIL, // Replace with your email in .env
                pass: process.env.EMAIL_KEY, // Replace with your email password or app password in .env
            },
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // Construct the full URL, ensure FRONTEND_URL is defined in .env
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `, // Use html field for HTML content
        };
        const info = yield transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Email sent", info: info.messageId });
    }
    catch (error) {
        console.error("Error sending reset password email:", error);
        if (error instanceof Error) {
            res.status(500).send("Error sending reset password email: " + error.message);
        }
        else {
            res.status(500).send("Error sending reset password email: An unexpected error occurred");
        }
    }
});
exports.resetPassword = resetPassword;
const checkAccessToken = (req, res, next) => {
    if (req.user) {
        res.status(200).json({
            message: "Token is valid",
            username: req.user.username,
            id: req.user.id,
        });
    }
    else {
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.checkAccessToken = checkAccessToken;
const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        res.status(200).json({ message: "Successfully logged out" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).send("Error logging out: An unexpected error occurred");
    }
};
exports.logoutUser = logoutUser;
