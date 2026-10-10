import { createApp } from './app.js';
import { assertEnv, env } from './config/env.js';
import { connectDb } from './config/db.js';

assertEnv();

const app = createApp();

try {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
