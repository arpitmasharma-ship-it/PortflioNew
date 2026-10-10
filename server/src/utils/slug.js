import slugify from 'slugify';

export function makeSlug(value) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(Model, base, excludeId) {
  let slug = makeSlug(base) || 'item';
  let n = 1;
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${makeSlug(base)}-${n++}`;
  }
  return slug;
}

export function readingTime(text) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
