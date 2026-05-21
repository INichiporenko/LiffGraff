import { Request, Response, NextFunction } from "express";
declare const ifPostAuthor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default ifPostAuthor;
