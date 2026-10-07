import { config } from './config.js';
import { createPool, pingDb } from './db.js';
import { createApp } from './app.js';

const pool = createPool();
const app = createApp(pool);

app.listen(config.port, async () => {
  console.log(`API listening on http://localhost:${config.port}`);
  if (await pingDb(pool)) console.log(`MySQL connected (${config.db.database})`);
  else console.warn('WARNING: cannot reach MySQL. Check .env and run "npm run db:init".');
});
