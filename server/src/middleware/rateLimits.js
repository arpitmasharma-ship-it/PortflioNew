import rateLimit from 'express-rate-limit';
import { isProduction } from '../config/env.js';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 8 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
  skip: () => !isProduction,
});

export const setupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProduction ? 5 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many setup attempts.' },
  skip: () => !isProduction,
});

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 5 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please wait before sending another.' },
  skip: () => !isProduction,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 300 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction,
});

