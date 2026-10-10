import { isProduction } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  void next;
  const status = err.statusCode || 500;
  const message =
    status === 500 && isProduction ? 'Internal server error' : err.message || 'Internal server error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    details: err.details || null,
    ...(isProduction || status < 500 ? {} : { stack: err.stack }),
  });
}
