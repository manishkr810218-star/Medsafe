import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { pingDb } from './db.js';
import { catalogRouter } from './routes/catalog.js';
import { medicinesRouter } from './routes/medicines.js';
import { interactionsRouter } from './routes/interactions.js';

const DB_DOWN_CODES = new Set([
  'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ER_NO_SUCH_TABLE',
]);

export function createApp(pool) {
  const app = express();
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', async (_req, res) => {
    const db = await pingDb(pool);
    res.status(db ? 200 : 503).json({ status: db ? 'ok' : 'degraded', db: db ? 'up' : 'down' });
  });

  app.use('/api', catalogRouter(pool));
  app.use('/api/medicines', medicinesRouter(pool));
  app.use('/api/interactions', interactionsRouter(pool));

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message });
    console.error(err);
    if (DB_DOWN_CODES.has(err.code)) {
      return res.status(503).json({ error: 'Database unavailable or not initialised. Run "npm run db:init".' });
    }
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
