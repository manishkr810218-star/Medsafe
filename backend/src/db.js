import mysql from 'mysql2/promise';
import { config } from './config.js';

// utf8mb4 is required so Hindi text round-trips correctly.
export function createPool() {
  return mysql.createPool({
    ...config.db,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export async function pingDb(pool) {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
