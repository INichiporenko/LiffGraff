import { Request, Response, NextFunction } from "express";
export declare const ifFollowed: (req: Request, res: Response, next: NextFunction) => Promise<void>;
