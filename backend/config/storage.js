
const storageConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  bucket: process.env.S3_BUCKET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
};

function validateStorageConfig() {
  const missing = Object.entries(storageConfig)
    .filter(([key, value]) => !value && key !== "region")
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing S3 configuration: ${missing.join(", ")}`
    );
  }

  return true;
}

module.exports = {
  storageConfig,
  validateStorageConfig
};
