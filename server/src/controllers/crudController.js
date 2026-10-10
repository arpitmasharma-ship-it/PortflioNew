import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { parsePagination, paginatedMeta } from '../utils/pagination.js';
import { uniqueSlug, readingTime } from '../utils/slug.js';

export function createCrudController(Model, options = {}) {
  const { publicFilter = { visible: true }, slugFrom } = options;

  const listPublic = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { ...publicFilter };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.q) {
      const q = req.query.q;
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { name: new RegExp(q, 'i') },
        { shortDescription: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') },
      ];
    }
    const [items, total] = await Promise.all([
      Model.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Model.countDocuments(filter),
    ]);
    sendSuccess(res, { data: items, meta: paginatedMeta({ page, limit, total }) });
  });

  const getBySlug = asyncHandler(async (req, res) => {
    const item = await Model.findOne({ slug: req.params.slug, ...publicFilter });
    if (!item) throw new ApiError(404, 'Not found');
    sendSuccess(res, { data: item });
  });

  const listAdmin = asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    sendSuccess(res, { data: items });
  });

  function cleanDates(body) {
    ['startDate', 'endDate', 'date', 'createdDate', 'publishedAt'].forEach((key) => {
      if (body[key] === '') body[key] = undefined;
    });
    return body;
  }

  const create = asyncHandler(async (req, res) => {
    const body = cleanDates({ ...req.body });
    if (slugFrom) {
      body.slug = await uniqueSlug(Model, body.slug || body[slugFrom]);
    }
    if (Model.modelName === 'BlogPost') {
      body.readingTime = readingTime(body.content);
      if (body.published) body.publishedAt = body.publishedAt || new Date();
    }
    const item = await Model.create(body);
    sendSuccess(res, { status: 201, data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const body = cleanDates({ ...req.body });
    if (slugFrom && (body.slug || body[slugFrom])) {
      body.slug = await uniqueSlug(Model, body.slug || body[slugFrom], req.params.id);
    }
    if (Model.modelName === 'BlogPost' && body.content) {
      body.readingTime = readingTime(body.content);
    }
    if (Model.modelName === 'BlogPost' && body.published) {
      const current = await Model.findById(req.params.id);
      if (current && !current.publishedAt) body.publishedAt = new Date();
    }
    const item = await Model.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!item) throw new ApiError(404, 'Not found');
    sendSuccess(res, { data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Not found');
    sendSuccess(res, { message: 'Deleted' });
  });

  const reorder = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    await Promise.all(ids.map((id, index) => Model.findByIdAndUpdate(id, { order: index })));
    sendSuccess(res, { message: 'Reordered' });
  });

  return { listPublic, getBySlug, listAdmin, create, update, remove, reorder };
}
