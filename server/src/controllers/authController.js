import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { setCsrfCookie } from '../middleware/csrf.js';
import {
  setupAdmin,
  loginAdmin,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  publicUser,
  hasAdmin,
} from '../services/authService.js';

export const getSetupStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { needsSetup: !(await hasAdmin()) } });
});

export const setup = asyncHandler(async (req, res) => {
  const user = await setupAdmin(req.body);
  const token = signToken(user);
  setAuthCookie(res, token);
  setCsrfCookie(res);
  sendSuccess(res, { status: 201, message: 'Admin created', data: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginAdmin(req.body);
  const token = signToken(user);
  setAuthCookie(res, token);
  setCsrfCookie(res);
  sendSuccess(res, { message: 'Signed in', data: publicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, { message: 'Signed out' });
});

export const me = asyncHandler(async (req, res) => {
  setCsrfCookie(res);
  sendSuccess(res, { data: publicUser(req.user) });
});
