"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ifAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token missing' });
        return; // Just return after sending the response
    }
    if (process.env.JWT_KEY) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
                return; // Just return after sending the response
            }
            if (decoded && typeof decoded !== 'string') {
                req.user = decoded;
                return next();
            }
            else {
                res.status(400).json({ message: 'Token is malformed or invalid' });
                return; // Just return after sending the response
            }
        });
    }
    else {
        res.status(500).json({ message: 'Server configuration error: JWT key not defined' });
        return; // Just return after sending the response
    }
};
exports.default = ifAuthenticated;
