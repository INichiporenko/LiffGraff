import { Request, Response } from 'express';
export declare const createPost: (req: Request, res: Response) => Promise<void>;
export declare const getPostById: (req: Request, res: Response) => Promise<void>;
export declare const getRandomPosts: (req: Request, res: Response) => Promise<void>;
export declare const likePost: (req: Request, res: Response) => Promise<void>;
export declare const unLikePost: (req: Request, res: Response) => Promise<void>;
export declare const deletePost: (req: Request, res: Response) => Promise<void>;
export declare const updatePost: (req: Request, res: Response) => Promise<void>;
export declare const getFollowedPosts: (req: Request, res: Response) => Promise<void>;
