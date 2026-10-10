import { Router } from 'express';
import { loginLimiter, setupLimiter } from '../middleware/rateLimits.js';
import { requireAuth } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/csrf.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, setupSchema } from '../validators/auth.js';
import { getSetupStatus, login, logout, me, setup } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.get('/setup-status', getSetupStatus);
authRouter.post('/setup', setupLimiter, validate(setupSchema), setup);
authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.post('/logout', requireAuth, requireCsrf, logout);
authRouter.get('/me', requireAuth, me);
