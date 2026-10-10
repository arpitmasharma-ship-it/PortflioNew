import { uploadImageBuffer } from '../services/uploadService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A file is required');
  const result = await uploadImageBuffer(req.file.buffer, 'portfolio');
  sendSuccess(res, { status: 201, data: result });
});
