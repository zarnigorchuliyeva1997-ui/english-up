
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const {
  storageConfig,
  validateStorageConfig
} = require("../config/storage");

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf"
];

let s3Client = null;

function getS3Client() {
  if (s3Client) return s3Client;

  validateStorageConfig();

  s3Client = new S3Client({
    endpoint: storageConfig.endpoint,
    region: storageConfig.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey
    }
  });

  return s3Client;
}

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return callback(
        new Error("Bu fayl turi yuklash uchun ruxsat etilmagan.")
      );
    }

    callback(null, true);
  }
});

async function uploadFile(file, folder = "media") {
  if (!file || !file.buffer) {
    throw new Error("Yuklanadigan fayl topilmadi.");
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error("Fayl turi ruxsat etilmagan.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fayl hajmi 100 MB dan oshmasligi kerak.");
  }

  const safeFolder = String(folder)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  if (!safeFolder) {
    throw new Error("Fayl papkasi noto‘g‘ri.");
  }

  const extension = path.extname(file.originalname || "").toLowerCase();
  const fileId = crypto.randomUUID();

  const key = `english-up/${safeFolder}/${fileId}${extension}`;

  const command = new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentLength: file.size
  });

  await getS3Client().send(command);

  return {
    key,
    originalName: file.originalname,
    contentType: file.mimetype,
    size: file.size
  };
}

async function deleteFile(key) {
  if (!key || typeof key !== "string") {
    throw new Error("Fayl manzili noto‘g‘ri.");
  }

  if (!key.startsWith("english-up/")) {
    throw new Error("Bu faylni o‘chirishga ruxsat yo‘q.");
  }

  const command = new DeleteObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key
  });

  await getS3Client().send(command);

  return { success: true };
}

async function getFileUrl(key, expiresIn = 900) {
  if (!key || !key.startsWith("english-up/")) {
    throw new Error("Fayl manzili noto‘g‘ri.");
  }

  const safeExpiry = Math.min(
    Math.max(Number(expiresIn) || 900, 60),
    3600
  );

  const command = new GetObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key
  });

  return getSignedUrl(
    getS3Client(),
    command,
    { expiresIn: safeExpiry }
  );
}

module.exports = {
  uploadMiddleware,
  uploadFile,
  deleteFile,
  getFileUrl
};
