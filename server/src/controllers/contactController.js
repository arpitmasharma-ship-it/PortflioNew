import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactNotification } from '../services/emailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { parsePagination, paginatedMeta } from '../utils/pagination.js';

export const createMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  await sendContactNotification(message);
  sendSuccess(res, {
    status: 201,
    message: 'Message received. Thank you for writing.',
    data: { id: message._id },
  });
});

export const listMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.read === 'true') filter.read = true;
  if (req.query.read === 'false') filter.read = false;
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, meta: paginatedMeta({ page, limit, total }) });
});

export const markRead = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  sendSuccess(res, { data: item });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  sendSuccess(res, { message: 'Deleted' });
});
