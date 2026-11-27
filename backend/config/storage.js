
const {
  S3Client
} = require("@aws-sdk/client-s3");

const storageConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  bucket: process.env.S3_BUCKET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
};

function validateStorageConfig() {
  const required = [
    "endpoint",
    "bucket",
    "accessKeyId",
    "secretAccessKey"
  ];

  const missing = required.filter(
    (key) => !storageConfig[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing S3 configuration: ${missing.join(", ")}`
    );
  }

  return true;
}

const s3 = new S3Client({
  endpoint: storageConfig.endpoint,
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretAccessKey
  },
  forcePathStyle: true
});

module.exports = {
  s3,
  bucketName: storageConfig.bucket,
  storageConfig,
  validateStorageConfig
};
