import { Request, Response } from "express";
export declare const getChatByReceiverUsername: (req: Request, res: Response) => Promise<void>;
export declare const getUserChats: (req: Request, res: Response) => Promise<void>;
export declare const getUnreadMessagesCount: (req: Request, res: Response) => Promise<void>;
