import { Request, Response } from "express";
export declare const getUserByUsername: (req: Request, res: Response) => Promise<void>;
export declare const searchUsers: (_req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response) => Promise<void>;
export declare const followUser: (req: Request, res: Response) => Promise<void>;
export declare const unfollowUser: (req: Request, res: Response) => Promise<void>;
export declare const addUserToSearchResults: (req: Request, res: Response) => Promise<void>;
