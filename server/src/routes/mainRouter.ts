import { Application } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./userRoutes";
import postsRouter from "./postRoutes";
import commentRouter from "./commentRoutes";
import messagesRouter from "./messageRoutes";

export const mainRouter = (app: Application) => {
    app.use("/api/auth", authRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/posts", postsRouter);
    app.use("/api/comments", commentRouter);
    app.use("/api/messages", messagesRouter);

    // Root endpoint
    app.get("/", (_req, res) => {
        res.send("index");
    });
};
