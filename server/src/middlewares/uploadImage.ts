import { Request } from 'express';
import multer from 'multer';

// Extend Express's Request interface to include 'files'
export interface MulterRequest extends Request {
    files: Express.Multer.File[]; // Type files explicitly
}

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (_req, file, callback) => {

        const allowedFileTypes = ['image/svg', 'image/svg+xml', 'image/webp', 'image/jpeg', 'image/jpg', 'image/png'];

        if (allowedFileTypes.includes(file.mimetype)) {
            callback(null, true); // Accept the file
        } else {
            callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPEG and PNG images are allowed!'));
        }
    }
});

export default upload