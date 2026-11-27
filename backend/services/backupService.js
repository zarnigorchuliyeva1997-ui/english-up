const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const {
  PutObjectCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const { pool } = require("../config/database");
const { s3, bucketName } = require("../config/storage");

// =========================================
// DATABASE CONFIG
// =========================================

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    return {
      host: url.hostname,
      port: url.port || "5432",
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      sslmode: url.searchParams.get("sslmode") || null
    };
  }

  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_SSLMODE
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error(
      "Database configuration is missing. Set DATABASE_URL or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME."
    );
  }

  return {
    host: DB_HOST,
    port: DB_PORT || "5432",
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    sslmode: DB_SSLMODE || null
  };
}

// =========================================
// PG_DUMP RUNNER
// =========================================

function runPgDump(outputPath) {
  return new Promise((resolve, reject) => {
    let config;

    try {
      config = getDatabaseConfig();
    } catch (error) {
      reject(error);
      return;
    }

    const args = [
      "--host", config.host,
      "--port", String(config.port),
      "--username", config.user,
      "--dbname", config.database,
      "--format=custom",
      "--no-owner",
      "--no-privileges",
      "--file", outputPath
    ];

    const child = spawn("pg_dump", args, {
      env: {
        ...process.env,
        PGPASSWORD: config.password,
        ...(config.sslmode ? { PGSSLMODE: config.sslmode } : {})
      }
    });

    let errorOutput = "";

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "pg_dump executable not found. Install PostgreSQL client tools on the server."
          )
        );
        return;
      }

      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(errorOutput || `pg_dump exited with code ${code}`));
      }
    });
  });
}

// =========================================
// CREATE BACKUP
// =========================================

async function createBackup(adminId) {
  if (!adminId) {
    throw new Error("Admin ID is required");
  }

  const tempPath = path.join(
    os.tmpdir(),
    `english-up-${crypto.randomUUID()}.dump`
  );

  try {
    await runPgDump(tempPath);

    const fileBuffer = await fs.promises.readFile(tempPath);
    const fileName = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.dump`;
    const storageKey = `english-up/backups/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: "application/octet-stream"
      })
    );

    const result = await pool.query(
      `INSERT INTO backups
         (file_name, storage_key, file_size, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fileName, storageKey, fileBuffer.length, "completed", adminId]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Backup creation failed: ${error.message}`);
  } finally {
    await fs.promises.unlink(tempPath).catch(() => {});
  }
}

// =========================================
// LIST BACKUPS
// =========================================

async function getBackups() {
  const result = await pool.query(
    `SELECT *
     FROM backups
     ORDER BY created_at DESC`
  );

  return result.rows;
}

// =========================================
// DELETE BACKUP
// =========================================

async function deleteBackup(backupId) {
  const result = await pool.query(
    `SELECT id, storage_key
     FROM backups
     WHERE id = $1`,
    [backupId]
  );

  if (result.rows.length === 0) {
    throw new Error("Backup not found");
  }

  const backup = result.rows[0];

  if (
    typeof backup.storage_key !== "string" ||
    !backup.storage_key.startsWith("english-up/backups/")
  ) {
    throw new Error("Invalid backup storage key");
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: backup.storage_key
    })
  );

  await pool.query(
    "DELETE FROM backups WHERE id = $1",
    [backupId]
  );

  return { success: true };
}

module.exports = {
  createBackup,
  getBackups,
  deleteBackup
};
