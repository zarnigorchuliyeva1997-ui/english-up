
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Barcha asosiy statistika
router.get("/", auth, admin, async (req, res, next) => {
  try {
    const [
      students,
      subscriptions,
      courses,
      lessons,
      tests,
      testResults,
      readingResults,
      writingResults,
      speakingResults
    ] = await Promise.all([
      pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active
         FROM users
         WHERE role = 'student'`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (
             WHERE status = 'active'
             AND end_date >= CURRENT_DATE
           )::int AS active
         FROM subscriptions`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active
         FROM courses`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active
         FROM lessons`
      ),

      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM tests
         WHERE is_active = TRUE`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS attempts,
           COALESCE(ROUND(AVG(score)), 0) AS average_score
         FROM test_attempts`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS attempts,
           COALESCE(ROUND(AVG(score)), 0) AS average_score
         FROM reading_attempts`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS submissions,
           COUNT(*) FILTER (WHERE status = 'reviewed')::int AS reviewed
         FROM writing_submissions`
      ),

      pool.query(
        `SELECT
           COUNT(*)::int AS submissions,
           COUNT(*) FILTER (WHERE status = 'reviewed')::int AS reviewed
         FROM speaking_submissions`
      )
    ]);

    res.json({
      success: true,
      statistics: {
        students: students.rows[0],
        subscriptions: subscriptions.rows[0],
        courses: courses.rows[0],
        lessons: lessons.rows[0],
        activeTests: tests.rows[0].total,
        tests: testResults.rows[0],
        reading: readingResults.rows[0],
        writing: writingResults.rows[0],
        speaking: speakingResults.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// Oxirgi 7 kunlik o'quvchi ro'yxatdan o'tish statistikasi
router.get(
  "/registrations",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           DATE(created_at) AS date,
           COUNT(*)::int AS registrations
         FROM users
         WHERE role = 'student'
           AND created_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      );

      res.json({
        success: true,
        period: "7 days",
        registrations: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// Oxirgi 7 kunlik test faolligi
router.get(
  "/test-activity",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           DATE(created_at) AS date,
           COUNT(*)::int AS attempts,
           COALESCE(ROUND(AVG(score)), 0) AS average_score
         FROM test_attempts
         WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      );

      res.json({
        success: true,
        period: "7 days",
        activity: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
