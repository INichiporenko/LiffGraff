"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (_req, file, callback) => {
        const allowedFileTypes = ['image/svg', 'image/svg+xml', 'image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedFileTypes.includes(file.mimetype)) {
            callback(null, true); // Accept the file
        }
        else {
            callback(new multer_1.default.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPEG and PNG images are allowed!'));
        }
    }
});
exports.default = upload;
