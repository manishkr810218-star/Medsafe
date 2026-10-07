// Usage: npm run db:init | db:seed | db:reset
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

const args = process.argv.slice(2);
const seedOnly = args.includes('--seed-only');
const reset = args.includes('--reset');
const { database, ...conn } = config.db;

if (!/^[A-Za-z0-9_]+$/.test(database)) {
  console.error('DB_NAME may only contain letters, digits and underscore.');
  process.exit(1);
}

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../db');
const read = (f) => readFile(path.join(dir, f), 'utf8');

const c = await mysql.createConnection({ ...conn, charset: 'utf8mb4', multipleStatements: true }).catch((e) => {
  console.error(`Cannot connect to MySQL at ${conn.host}:${conn.port} as ${conn.user}: ${e.message}`);
  process.exit(1);
});

try {
  if (reset) {
    await c.query(`DROP DATABASE IF EXISTS \`${database}\``);
    console.log(`Dropped database ${database}`);
  }
  await c.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4`);
  await c.query(`USE \`${database}\``);
  if (!seedOnly) {
    await c.query(await read('schema.sql'));
    console.log('Schema applied');
  }
  await c.query(await read('seed.sql'));
  console.log('DEMO seed data applied');
} catch (e) {
  console.error('Database setup failed:', e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
