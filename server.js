
const express = require("express");
const cors = require("cors");
const path = require("path");

const {
  testDatabase,
  closeDatabase
} = require("./backend/config/database");

const app = express();

app.disable("x-powered-by");

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// =========================================
// CORS CONFIGURATION
// =========================================

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, "");

    callback(
      null,
      allowedOrigins.includes(normalizedOrigin)
    );
  },
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],
  optionsSuccessStatus: 204
}));

// =========================================
// BODY PARSING
// =========================================

app.use(express.json({
  limit: "10mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}));

// =========================================
// API HEALTH
// =========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online",
    service: "English Up API",
    timestamp: new Date().toISOString()
  });
});

// =========================================
// DATABASE HEALTH
// =========================================

app.get("/api/health/database", async (req, res) => {
  try {
    const result = await testDatabase();

    res.json({
      success: true,
      database: "connected",
      time: result.current_time,
      databaseName: result.database_name
    });
  } catch (error) {
    console.error(
      "Database health check failed:",
      error.message
    );

    res.status(503).json({
      success: false,
      database: "disconnected",
      message: "PostgreSQL connection failed"
    });
  }
});

// =========================================
// API ROUTES
// =========================================

app.use("/api/auth", require("./backend/routes/auth"));
app.use("/api/users", require("./backend/routes/users"));
app.use("/api/admin", require("./backend/routes/admin"));

app.use(
  "/api/activation-codes",
  require("./backend/routes/activationCodes")
);

app.use(
  "/api/announcements",
  require("./backend/routes/announcements")
);

app.use("/api/backup", require("./backend/routes/backup"));
app.use("/api/courses", require("./backend/routes/courses"));
app.use("/api/files", require("./backend/routes/files"));
app.use("/api/lessons", require("./backend/routes/lessons"));

app.use("/api/listening", require("./backend/routes/listening"));
app.use("/api/messages", require("./backend/routes/messages"));
app.use("/api/progress", require("./backend/routes/progress"));

app.use("/api/reading", require("./backend/routes/reading"));
app.use("/api/results", require("./backend/routes/results"));
app.use("/api/security", require("./backend/routes/security"));

app.use("/api/speaking", require("./backend/routes/speaking"));
app.use("/api/statistics", require("./backend/routes/statistics"));
app.use(
  "/api/subscriptions",
  require("./backend/routes/subscriptions")
);

app.use("/api/tests", require("./backend/routes/tests"));
app.use("/api/vocabulary", require("./backend/routes/vocabulary"));
app.use("/api/writing", require("./backend/routes/writing"));

// =========================================
// FRONTEND ROUTES
// =========================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =========================================
// STATIC FILE SECURITY
// =========================================

const blockedPaths = new Set([
  "backend",
  "node_modules",
  ".git",
  ".github",
  ".vscode"
]);

const blockedFiles = new Set([
  "server.js",
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml"
]);

const allowedExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".mp3",
  ".wav",
  ".ogg",
  ".mp4",
  ".webm",
  ".pdf"
]);

app.use((req, res, next) => {
  if (
    req.method !== "GET" &&
    req.method !== "HEAD"
  ) {
    return res.status(404).json({
      success: false,
      message: "File not found"
    });
  }

  let requestedPath;

  try {
    requestedPath = decodeURIComponent(req.path);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid file path"
    });
  }

  if (
    requestedPath.includes("\0") ||
    requestedPath.includes("\\")
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid file path"
    });
  }

  const normalizedPath = path.posix.normalize(
    requestedPath
  );

  const segments = normalizedPath
    .split("/")
    .filter(Boolean);

  const filename =
    segments[segments.length - 1] || "";

  const containsBlockedPath = segments.some(segment => {
    const name = segment.toLowerCase();

    return (
      blockedPaths.has(name) ||
      name.startsWith(".")
    );
  });

  const isBlockedFile = blockedFiles.has(
    filename.toLowerCase()
  );

  const extension = path.extname(filename).toLowerCase();

  if (
    containsBlockedPath ||
    isBlockedFile ||
    !allowedExtensions.has(extension)
  ) {
    return res.status(404).json({
      success: false,
      message: "File not found"
    });
  }

  next();
});

// =========================================
// FRONTEND STATIC FILES
// =========================================

app.use(express.static(__dirname, {
  index: false,
  dotfiles: "deny",
  fallthrough: true,

  maxAge: process.env.NODE_ENV === "production"
    ? "1d"
    : 0,

  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    }

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );
  }
}));

// =========================================
// 404 HANDLER
// =========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint or file not found"
  });
});

// =========================================
// GLOBAL ERROR HANDLER
// =========================================

app.use((error, req, res, next) => {
  console.error("Server error:", {
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    code: error.code
  });

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : Number.isInteger(error.status) &&
        error.status >= 400 &&
        error.status <= 599
        ? error.status
        : 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500
      ? "Internal server error"
      : error.message
  });
});

// =========================================
// START SERVER
// =========================================

const PORT = Number(process.env.PORT || 3000);

if (
  !Number.isInteger(PORT) ||
  PORT < 1 ||
  PORT > 65535
) {
  throw new Error("Invalid PORT configuration");
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`English Up running on port ${PORT}`);
});

// =========================================
// GRACEFUL SHUTDOWN
// =========================================

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`${signal} received. Closing server...`);

  server.close(async (error) => {
    if (error) {
      console.error(
        "HTTP server shutdown error:",
        error
      );

      process.exitCode = 1;
    }

    try {
      await closeDatabase();
      console.log("Database pool closed.");
    } catch (dbError) {
      console.error(
        "Database shutdown error:",
        dbError.message
      );

      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
