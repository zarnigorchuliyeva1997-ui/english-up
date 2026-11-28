
const { Pool } = require("pg");
const fs = require("fs");

// =========================================
// DATABASE CONFIGURATION
// =========================================

function readDatabaseUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid PostgreSQL connection URL"
    );
  }

  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error(
      "DATABASE_URL must use postgres:// or postgresql://"
    );
  }

  const database = decodeURIComponent(
    url.pathname.replace(/^\//, "")
  );

  if (!url.hostname || !database || !url.username) {
    throw new Error(
      "DATABASE_URL must include a host, database name, and username"
    );
  }

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    database,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    sslMode:
      url.searchParams.get("sslmode") ||
      process.env.DB_SSLMODE ||
      null,
    applicationName:
      url.searchParams.get("application_name") || "english-up"
  };
}

function readIndividualDatabaseConfig() {
  const config = {
    host: process.env.DB_HOST || process.env.PGHOST,
    port: Number(
      process.env.DB_PORT || process.env.PGPORT || 5432
    ),
    database:
      process.env.DB_NAME || process.env.PGDATABASE,
    user:
      process.env.DB_USER || process.env.PGUSER,
    password:
      process.env.DB_PASSWORD || process.env.PGPASSWORD,
    sslMode: process.env.DB_SSLMODE || null,
    applicationName: "english-up"
  };

  const missing = [];

  if (!config.host) missing.push("DB_HOST");
  if (!config.database) missing.push("DB_NAME");
  if (!config.user) missing.push("DB_USER");
  if (!config.password) missing.push("DB_PASSWORD");

  if (missing.length > 0) {
    throw new Error(
      `Missing database environment variables: ${missing.join(", ")}. ` +
      "Set DATABASE_URL or DB_HOST, DB_NAME, DB_USER and DB_PASSWORD."
    );
  }

  return config;
}

function getDatabaseConfig() {
  const config = process.env.DATABASE_URL
    ? readDatabaseUrl(process.env.DATABASE_URL)
    : readIndividualDatabaseConfig();

  if (
    !Number.isInteger(config.port) ||
    config.port < 1 ||
    config.port > 65535
  ) {
    throw new Error(
      "Database port must be a valid number between 1 and 65535"
    );
  }

  return config;
}

// =========================================
// SSL CONFIGURATION
// =========================================

function getSslConfig(databaseConfig) {
  const mode = String(
    databaseConfig.sslMode || process.env.DB_SSL || ""
  ).trim().toLowerCase();

  if (["disable", "false", "0", "off"].includes(mode)) {
    return false;
  }

  if (mode === "require") {
    return { rejectUnauthorized: false };
  }

  if (
    ["verify-ca", "verify-full", "true", "1", "on"].includes(mode)
  ) {
    const ssl = { rejectUnauthorized: true };
    const caValue = process.env.DB_SSL_CA;

    if (caValue) {
      const normalizedCa = caValue.replace(/\\n/g, "\n");

      ssl.ca = normalizedCa.includes("-----BEGIN")
        ? normalizedCa
        : fs.readFileSync(normalizedCa, "utf8");
    }

    return ssl;
  }

  if (mode) {
    throw new Error(
      "Unsupported DB_SSLMODE. Use disable, require, verify-ca or verify-full."
    );
  }

  return false;
}

// =========================================
// CREATE CONNECTION POOL
// =========================================

const databaseConfig = getDatabaseConfig();
const ssl = getSslConfig(databaseConfig);

const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  user: databaseConfig.user,
  password: databaseConfig.password,
  application_name: databaseConfig.applicationName,
  ssl,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: Number(
    process.env.DB_IDLE_TIMEOUT_MS || 30000
  ),
  connectionTimeoutMillis: Number(
    process.env.DB_CONNECTION_TIMEOUT_MS || 30000
  ),
  allowExitOnIdle: false
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

// =========================================
// DATABASE HEALTH CHECK
// =========================================

async function testDatabase() {
  const result = await pool.query(`
    SELECT
      NOW() AS current_time,
      current_database() AS database_name,
      current_user AS database_user
  `);

  return result.rows[0];
}

// =========================================
// CLOSE CONNECTION POOL
// =========================================

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  pool,
  testDatabase,
  closeDatabase
};
