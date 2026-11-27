
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, bucketName } = require("../config/storage");

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "video/mp4",
  "video/webm",
  "application/pdf"
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return callback(new Error("File type is not allowed"));
    }

    callback(null, true);
  }
});

async function uploadFile(file, folder = "uploads") {
  if (
    !file ||
    !Buffer.isBuffer(file.buffer) ||
    !file.originalname ||
    !ALLOWED_TYPES.includes(file.mimetype)
  ) {
    throw new Error("Invalid file");
  }

  if (
    file.buffer.length === 0 ||
    file.buffer.length > MAX_FILE_SIZE
  ) {
    throw new Error("Invalid file size");
  }

  const safeFolder = String(folder)
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 50);

  if (!safeFolder) {
    throw new Error("Invalid folder name");
  }

  const extension = path.extname(file.originalname)
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "")
    .slice(0, 10);

  const fileName = `${crypto.randomUUID()}${extension}`;
  const key = `english-up/${safeFolder}/${fileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return {
    key,
    fileName,
    originalName: path.basename(file.originalname).slice(0, 255),
    mimeType: file.mimetype,
    size: file.buffer.length
  };
}

function validateFileKey(key) {
  if (
    typeof key !== "string" ||
    !key.startsWith("english-up/") ||
    key.includes("..") ||
    key.includes("\\") ||
    key.length > 500
  ) {
    throw new Error("Invalid file key");
  }
}

async function deleteFile(key) {
  validateFileKey(key);

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    })
  );

  return { success: true };
}

async function getFileUrl(key, expiresIn = 900) {
  validateFileKey(key);

  const duration = Math.min(
    Math.max(Number(expiresIn) || 900, 60),
    3600
  );

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return getSignedUrl(s3, command, {
    expiresIn: duration
  });
}

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  getFileUrl
};
