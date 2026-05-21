"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const commentRoutes_1 = __importDefault(require("./commentRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const mainRouter = (app) => {
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/users", userRoutes_1.default);
    app.use("/api/posts", postRoutes_1.default);
    app.use("/api/comments", commentRoutes_1.default);
    app.use("/api/messages", messageRoutes_1.default);
    // Root endpoint
    app.get("/", (_req, res) => {
        res.send("index");
    });
};
exports.mainRouter = mainRouter;
