import { BlogPost } from '../models/BlogPost.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { parsePagination, paginatedMeta } from '../utils/pagination.js';

export const listPublished = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    filter.$or = [
      { title: new RegExp(req.query.q, 'i') },
      { excerpt: new RegExp(req.query.q, 'i') },
      { tags: new RegExp(req.query.q, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
    BlogPost.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: paginatedMeta({ page, limit, total }) });
});

export const getPublished = asyncHandler(async (req, res) => {
  const item = await BlogPost.findOne({ slug: req.params.slug, published: true });
  if (!item) throw new ApiError(404, 'Post not found');
  sendSuccess(res, { data: item });
});
