import { NextFunction, Response, Request } from "express";
declare const ifAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
export default ifAuthenticated;
