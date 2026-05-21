import { Request, Response, NextFunction } from "express";
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkAccessToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const logoutUser: (req: Request, res: Response) => void;
