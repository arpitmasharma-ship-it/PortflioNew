import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/csrf.js';
import { authRouter } from './auth.routes.js';
import { publicRouter } from './public.routes.js';
import { adminRouter } from './admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use(publicRouter);
apiRouter.use('/admin', requireAuth, requireCsrf, adminRouter);
