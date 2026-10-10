import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env, isProduction } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function hasAdmin() {
  return Boolean(await User.exists({}));
}

export async function setupAdmin({ email, password, name }) {
  if (await hasAdmin()) {
    throw new ApiError(403, 'Admin already exists. Registration is closed.');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ email, passwordHash, name: name || 'Admin' });
}

export async function loginAdmin({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, 'Invalid email or password');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'Invalid email or password');
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}

export function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    lastLoginAt: user.lastLoginAt,
  };
}
