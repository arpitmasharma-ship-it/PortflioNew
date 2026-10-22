import { describe, expect, it } from 'vitest';
import { isCloudinaryUrl, getOptimizedImageUrl, extractPublicId } from './cloudinary.js';

describe('cloudinary helpers', () => {
  const sampleUrl = 'https://res.cloudinary.com/mycloud/image/upload/v1234567890/portfolio/sample.jpg';

  it('detects cloudinary URLs correctly', () => {
    expect(isCloudinaryUrl(sampleUrl)).toBe(true);
    expect(isCloudinaryUrl('https://images.unsplash.com/photo-123')).toBe(false);
    expect(isCloudinaryUrl('')).toBe(false);
    expect(isCloudinaryUrl(null)).toBe(false);
  });

  it('optimizes cloudinary URLs with responsive transformations', () => {
    const optimized = getOptimizedImageUrl(sampleUrl, { width: 800 });
    expect(optimized).toContain('/upload/f_auto,q_auto,w_800,c_limit/');
    expect(optimized).toContain('sample.jpg');
  });

  it('returns non-cloudinary URLs untouched', () => {
    const external = 'https://example.com/image.png';
    expect(getOptimizedImageUrl(external, { width: 400 })).toBe(external);
    expect(getOptimizedImageUrl('', { width: 400 })).toBe('');
  });

  it('extracts publicId correctly from Cloudinary URLs', () => {
    expect(extractPublicId(sampleUrl)).toBe('portfolio/sample');
    expect(extractPublicId('https://res.cloudinary.com/mycloud/image/upload/sample.png')).toBe('sample');
    expect(extractPublicId('https://other.com/sample.jpg')).toBe(null);
  });
});
