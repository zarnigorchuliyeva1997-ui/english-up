
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const { pool } = require("../config/database");
const {
  storageConfig,
  validateStorageConfig
} = require("../config/storage");

function getS3Client() {
  validateStorageConfig();

  return new S3Client({
    endpoint: storageConfig.endpoint,
    region: storageConfig.region,
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey
    },
    forcePathStyle: true
  });
}

// PostgreSQL backup faylini yaratish
function createDatabaseDump(outputPath) {
  return new Promise((resolve, reject) => {
    if (!process.env.DATABASE_URL) {
      return reject(new Error("DATABASE_URL sozlanmagan."));
    }

    const dump = spawn(
      "pg_dump",
      [
        "--dbname",
        process.env.DATABASE_URL,
        "--format=custom",
        "--no-owner",
        "--no-acl",
        "--file",
        outputPath
      ],
      {
        shell: false,
        stdio: ["ignore", "ignore", "pipe"]
      }
    );

    let errorOutput = "";

    dump.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });

    dump.on("error", (error) => {
      reject(error);
    });

    dump.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(
          new Error(
            `pg_dump xatosi. Kod: ${code}. ${errorOutput}`
          )
        );
      }
    });
  });
}

// Backup yaratish va S3 ga yuklash
async function createBackup() {
  const client = getS3Client();

  const backupId = crypto.randomUUID();
  const fileName = `english-up-backup-${backupId}.dump`;
  const storageKey = `english-up/backups/${fileName}`;
  const outputPath = path.join(
    os.tmpdir(),
    fileName
  );

  let uploaded = false;

  try {
    await createDatabaseDump(outputPath);

    const fileBuffer = await fs.promises.readFile(outputPath);
    const fileSize = fileBuffer.length;

    await client.send(
      new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: "application/octet-stream",
        Metadata: {
          backupid: backupId
        }
      })
    );

    uploaded = true;

    const result = await pool.query(
      `INSERT INTO backups
       (file_name, storage_key, file_size, status)
       VALUES ($1, $2, $3, 'completed')
       RETURNING id, file_name, storage_key, file_size, status, created_at`,
      [fileName, storageKey, fileSize]
    );

    return result.rows[0];
  } catch (error) {
    if (uploaded) {
      try {
        await client.send(
          new DeleteObjectCommand({
            Bucket: storageConfig.bucket,
            Key: storageKey
          })
        );
      } catch (deleteError) {
        console.error(
          "Yuklangan backupni tozalash xatosi:",
          deleteError.message
        );
      }
    }

    throw error;
  } finally {
    try {
      await fs.promises.unlink(outputPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(
          "Vaqtinchalik faylni o'chirish xatosi:",
          error.message
        );
      }
    }
  }
}

// Backup faylini S3 dan o'chirish
async function deleteBackupFile(storageKey) {
  if (
    typeof storageKey !== "string" ||
    !storageKey.startsWith("english-up/backups/")
  ) {
    throw new Error("Backup fayl manzili noto'g'ri.");
  }

  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: storageConfig.bucket,
      Key: storageKey
    })
  );

  return true;
}

module.exports = {
  createBackup,
  deleteBackupFile
};
