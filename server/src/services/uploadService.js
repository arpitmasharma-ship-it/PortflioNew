import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

let configured = false;

/**
 * Checks whether Cloudinary has configuration credentials available.
 */
export function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL || env.cloudinary?.url) return true;
  return Boolean(
    env.cloudinary?.cloudName &&
    env.cloudinary?.apiKey &&
    env.cloudinary?.apiSecret
  );
}

/**
 * Ensures Cloudinary is initialized and configured with credentials.
 */
export function ensureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      400,
      'Cloudinary is not configured on the server. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables (e.g. Render Dashboard).'
    );
  }

  if (!configured) {
    const rawUrl = process.env.CLOUDINARY_URL || env.cloudinary?.url;
    if (rawUrl) {
      cloudinary.config(rawUrl);
    } else {
      cloudinary.config({
        cloud_name: env.cloudinary.cloudName,
        api_key: env.cloudinary.apiKey,
        api_secret: env.cloudinary.apiSecret,
        secure: true,
      });
    }
    configured = true;
  }

  return cloudinary;
}

/**
 * Ping Cloudinary to verify live API connection.
 */
export async function pingCloudinary() {
  ensureCloudinary();
  try {
    const res = await cloudinary.api.ping();
    return { status: 'ok', ...res };
  } catch (error) {
    throw new ApiError(500, `Cloudinary connection check failed: ${error.message || error}`);
  }
}

/**
 * Upload a file buffer to Cloudinary.
 * Uses resource_type: 'auto' so images and PDFs/docs are handled seamlessly.
 */
export async function uploadImageBuffer(buffer, folder = 'portfolio', options = {}) {
  ensureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: options.resourceType || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          const detail = error.error?.message || error.message || 'Image upload to Cloudinary failed.';
          const statusCode = error.http_code || 400;
          return reject(new ApiError(statusCode, detail));
        }
        resolve({
          url: result.secure_url || result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
        });
      },
    );
    stream.end(buffer);
  });
}

/**
 * Delete an asset from Cloudinary by its publicId.
 */
export async function deleteCloudinaryAsset(publicId, resourceType = 'image') {
  ensureCloudinary();
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    const statusCode = error.http_code || 400;
    throw new ApiError(statusCode, error.error?.message || error.message || 'Failed to delete asset from Cloudinary');
  }
}
