const express = require("express");
const cors = require("cors");
const path = require("path"); // <--- YANGI QO'SHILDI

const {
  testDatabase,
  closeDatabase
} = require("./backend/config/database");

const app = express();

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}));

// =========================================
// BASIC ROUTES
// =========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "online",
    service: "English Up API"
  });
});

// =========================================
// DATABASE HEALTH CHECK
// =========================================

app.get("/api/health/database", async (req, res) => {
  try {
    const result = await testDatabase();

    res.json({
      success: true,
      database: "connected",
      time: result.current_time
    });
  } catch (error) {
    console.error(
      "Database health check failed:",
      error
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

app.use("/api/activation-codes", require("./backend/routes/activationCodes"));
app.use("/api/announcements", require("./backend/routes/announcements"));
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
app.use("/api/subscriptions", require("./backend/routes/subscriptions"));

app.use("/api/tests", require("./backend/routes/tests"));
app.use("/api/vocabulary", require("./backend/routes/vocabulary"));
app.use("/api/writing", require("./backend/routes/writing"));

// =========================================
// FRONTEND STATIC FILES (XAVFSIZ USUL)
// =========================================

// 1. Admin papkasini ochish (faqat admin ichidagi fayllar)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// 2. Asosiy papkadagi faqat kerakli fayllarni ochish (HTML, CSS, JS)
// Backend, node_modules va .env kabi fayllar yopiq qoladi
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

// Rasm yoki boshqa statik fayllar uchun (agar papkada bo'lsa)
// app.use(express.static(path.join(__dirname, 'public'))); 

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
    code: error.code,
    stack: error.stack
  });

  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
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

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `English Up Backend running on port ${PORT}`
  );
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
      console.error("HTTP server shutdown error:", error);
      process.exitCode = 1;
    }

    try {
      await closeDatabase();
      console.log("Database pool closed.");
    } catch (dbError) {
      console.error(
        "Database shutdown error:",
        dbError
      );
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
