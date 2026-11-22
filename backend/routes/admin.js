
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

// Admin dashboard statistikasi
router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM users
           WHERE role = 'student') AS total_students,

          (SELECT COUNT(*) FROM subscriptions
           WHERE status = 'active'
           AND end_date > NOW()) AS active_subscriptions,

          (SELECT COUNT(*) FROM courses
           WHERE is_active = TRUE) AS total_courses,

          (SELECT COUNT(*) FROM lessons
           WHERE is_active = TRUE) AS total_lessons
      `);

      res.json({
        success: true,
        statistics: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// O'quvchilar ro'yxati
router.get(
  "/students",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(
        100,
        Math.max(1, Number(req.query.limit) || 20)
      );

      const offset = (page - 1) * limit;

      const result = await pool.query(
        `SELECT id, name, email, created_at
         FROM users
         WHERE role = 'student'
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const count = await pool.query(
        "SELECT COUNT(*) FROM users WHERE role = 'student'"
      );

      res.json({
        success: true,
        students: result.rows,
        pagination: {
          page,
          limit,
          total: Number(count.rows[0].count)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
