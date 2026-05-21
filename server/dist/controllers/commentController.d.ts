import { Request, Response } from "express";
export declare const addCommentToPost: (req: Request, res: Response) => Promise<void>;
export declare const likeComment: (req: Request, res: Response) => Promise<void>;
export declare const unLikeComment: (req: Request, res: Response) => Promise<void>;
export declare const deleteComment: (req: Request, res: Response) => Promise<void>;
