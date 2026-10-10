import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, isProduction } from './config/env.js';
import { apiLimiter } from './middleware/rateLimits.js';
import { requireTrustedOrigin } from './middleware/csrf.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use('/api', apiLimiter);
  app.use('/api', requireTrustedOrigin);

  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Portfolio API is online and healthy', health: '/health' });
  });

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'ok', data: { uptime: process.uptime() } });
  });

  app.use('/api', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
