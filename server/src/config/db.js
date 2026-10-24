import pg from "pg";
import { config } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  ssl: config.databaseUrl && (config.databaseUrl.includes("localhost") || config.databaseUrl.includes("127.0.0.1"))
    ? false
    : { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

/**
 * Execute parameterized query with safety checks
 */
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === "development" && duration > 500) {
    console.warn(`Slow PostgreSQL query (${duration}ms):`, text);
  }
  return res;
}

/**
 * Run callback within a database transaction
 */
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Check if database is connected and healthy
 */
export async function checkDatabaseHealth() {
  try {
    const res = await pool.query("SELECT 1 as healthy;");
    return res.rows[0]?.healthy === 1;
  } catch (err) {
    return false;
  }
}
