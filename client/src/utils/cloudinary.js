/**
 * Check if a URL points to Cloudinary CDN
 */
export function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com');
}

/**
 * Transforms a Cloudinary image URL to apply on-the-fly responsive optimization.
 * Defaults to auto format (WebP/AVIF) and auto compression quality.
 *
 * @param {string} url - Original Cloudinary image URL
 * @param {object} options - Options { width, height, crop = 'limit', quality = 'auto', format = 'auto' }
 * @returns {string} - Optimized URL or original URL if not Cloudinary
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !isCloudinaryUrl(url)) return url || '';

  const {
    width,
    height,
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transforms = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  if (!transforms.length) return url;

  const transformString = transforms.join(',');
  // Insert transformation right after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Extract publicId from a Cloudinary URL (helpful for deletion/management).
 */
export function extractPublicId(url) {
  if (!url || !isCloudinaryUrl(url)) return null;
  try {
    const afterUpload = url.split('/upload/')[1];
    if (!afterUpload) return null;
    // Strip version prefix if present (e.g. v1623456789/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Strip file extension
    const dotIndex = withoutVersion.lastIndexOf('.');
    return dotIndex !== -1 ? withoutVersion.substring(0, dotIndex) : withoutVersion;
  } catch {
    return null;
  }
}
