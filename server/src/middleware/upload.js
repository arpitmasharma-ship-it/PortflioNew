import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);

const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!allowed.has(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPEG, PNG, WebP, GIF, or PDF files are allowed'));
    }
    cb(null, true);
  },
}).single('file');
