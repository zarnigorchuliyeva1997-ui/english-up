
const express = require("express");
const cors = require("cors");

const { testDatabase } = require("./backend/config/database");

const app = express();

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================================
// BASIC ROUTES
// =========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "English Up",
    message: "English Up Backend is running"
  });
});

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
    console.error("Database health check failed:", error.message);

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
// 404 HANDLER
// =========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// =========================================
// GLOBAL ERROR HANDLER
// =========================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  const statusCode = error.statusCode || 500;

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`English Up Backend running on port ${PORT}`);
});
