import {
  uploadImageBuffer,
  deleteCloudinaryAsset,
  isCloudinaryConfigured,
  pingCloudinary,
} from '../services/uploadService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { env } from '../config/env.js';

export const getUploadStatus = asyncHandler(async (req, res) => {
  const configured = isCloudinaryConfigured();
  let connected = false;
  let connectionError = null;

  if (configured) {
    try {
      await pingCloudinary();
      connected = true;
    } catch (err) {
      connectionError = err.message;
    }
  }

  sendSuccess(res, {
    data: {
      configured,
      connected,
      cloudName: env.cloudinary.cloudName || (process.env.CLOUDINARY_URL ? 'configured via CLOUDINARY_URL' : null),
      error: connectionError,
    },
  });
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A file is required for upload');
  const folder = req.query.folder || req.body.folder || 'portfolio';
  const result = await uploadImageBuffer(req.file.buffer, folder);
  sendSuccess(res, { status: 201, data: result });
});

export const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) {
    throw new ApiError(400, 'At least one file is required for upload');
  }
  const folder = req.query.folder || req.body.folder || 'portfolio';
  const results = await Promise.all(
    req.files.map((file) => uploadImageBuffer(file.buffer, folder))
  );
  sendSuccess(res, { status: 201, data: results });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { publicId, resourceType } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required to delete an asset');
  const result = await deleteCloudinaryAsset(publicId, resourceType || 'image');
  sendSuccess(res, { data: result });
});
