
const { Pool } = require("pg");

const requiredEnv = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD"
];

const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing database environment variables: ${missingEnv.join(", ")}`
  );
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false
});

pool.on("error", (error) => {
  console.error(
    "Unexpected PostgreSQL pool error:",
    error
  );
});

async function testDatabase() {
  const result = await pool.query(`
    SELECT
      NOW() AS current_time,
      current_database() AS database_name,
      current_user AS database_user
  `);

  return result.rows[0];
}

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  pool,
  testDatabase,
  closeDatabase
};
