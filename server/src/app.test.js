import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

describe('health and public API shape', () => {
  it('returns health payload', async () => {
    const app = createApp();
    const server = app.listen(0);
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await res.json();
    server.close();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
  });

  it('rejects unauthenticated admin routes', async () => {
    const app = createApp();
    const server = app.listen(0);
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/admin/stats`);
    const body = await res.json();
    server.close();
    assert.equal(res.status, 401);
    assert.equal(body.success, false);
  });

  it('rejects unauthenticated upload routes', async () => {
    const app = createApp();
    const server = app.listen(0);
    const { port } = server.address();
    const resStatus = await fetch(`http://127.0.0.1:${port}/api/admin/upload/status`);
    const resUpload = await fetch(`http://127.0.0.1:${port}/api/admin/upload`, { method: 'POST' });
    server.close();
    assert.equal(resStatus.status, 401);
    assert.equal(resUpload.status, 401);
  });
});
