
const {
  S3Client
} = require("@aws-sdk/client-s3");

// =========================================
// STORAGE CONFIGURATION
// =========================================

const storageConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  bucket: process.env.S3_BUCKET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
};

// =========================================
// VALIDATE STORAGE CONFIGURATION
// =========================================

function validateStorageConfig() {
  const required = {
    S3_ENDPOINT: storageConfig.endpoint,
    S3_BUCKET: storageConfig.bucket,
    S3_ACCESS_KEY: storageConfig.accessKeyId,
    S3_SECRET_KEY: storageConfig.secretAccessKey
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing S3 configuration: ${missing.join(", ")}`
    );
  }

  let endpoint;

  try {
    endpoint = new URL(storageConfig.endpoint);
  } catch {
    throw new Error("S3_ENDPOINT must be a valid URL");
  }

  if (!["http:", "https:"].includes(endpoint.protocol)) {
    throw new Error("S3_ENDPOINT must use HTTP or HTTPS");
  }

  if (
    !/^[a-zA-Z0-9._-]+$/.test(storageConfig.bucket)
  ) {
    throw new Error("Invalid S3 bucket name");
  }

  return true;
}

// =========================================
// S3 CLIENT
// =========================================

const s3 = new S3Client({
  endpoint: storageConfig.endpoint || undefined,

  region: storageConfig.region,

  credentials: async () => {
    validateStorageConfig();

    return {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey
    };
  },

  forcePathStyle: true,

  maxAttempts: 3
});

// =========================================
// STORAGE HEALTH CHECK
// =========================================

function getStorageStatus() {
  try {
    validateStorageConfig();

    return {
      configured: true,
      provider: "S3",
      endpoint: storageConfig.endpoint,
      bucket: storageConfig.bucket,
      region: storageConfig.region
    };
  } catch (error) {
    return {
      configured: false,
      provider: "S3",
      error: error.message
    };
  }
}

// =========================================
// EXPORTS
// =========================================

module.exports = {
  s3,
  bucketName: storageConfig.bucket,
  storageConfig,
  validateStorageConfig,
  getStorageStatus
};
