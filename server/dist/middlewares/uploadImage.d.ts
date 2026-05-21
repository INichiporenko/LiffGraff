import { Request } from 'express';
import multer from 'multer';
export interface MulterRequest extends Request {
    files: Express.Multer.File[];
}
declare const upload: multer.Multer;
export default upload;
