import crypto from 'node:crypto';
import { env, isProduction, isAllowedOrigin } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const CSRF_COOKIE = 'portfolio_csrf';

export function setCsrfCookie(res) {
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

export function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const header = req.get('x-csrf-token');
  const cookie = req.cookies?.[CSRF_COOKIE];
  if (!header || !cookie || header !== cookie) {
    return next(new ApiError(403, 'Invalid CSRF token'));
  }
  return next();
}

export function requireTrustedOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (!origin) return next();
  if (!isAllowedOrigin(origin)) {
    return next(new ApiError(403, 'Untrusted origin'));
  }
  return next();
}
