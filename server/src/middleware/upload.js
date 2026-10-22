import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        `File type "${file.mimetype}" is not supported. Allowed formats: JPEG, PNG, WebP, GIF, SVG, and PDF.`
      )
    );
  }
  cb(null, true);
}

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

export const uploadSingle = multer({
  storage,
  limits,
  fileFilter,
}).single('file');

export const uploadMultiple = multer({
  storage,
  limits,
  fileFilter,
}).array('files', 10);
