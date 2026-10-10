export function sendSuccess(res, { data = null, message = 'OK', status = 200, meta } = {}) {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}
