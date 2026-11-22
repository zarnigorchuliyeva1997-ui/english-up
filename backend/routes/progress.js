
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");

// O'quvchining umumiy progressini olish
router.get(
  "/me",
  authenticateToken,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE completed = TRUE) AS completed_lessons,
           COUNT(*) AS total_attempts,
           COALESCE(AVG(score), 0) AS average_score
         FROM learning_progress
         WHERE user_id = $1`,
        [req.user.id]
      );

      res.json({
        success: true,
        progress: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Dars yoki test natijasini saqlash
router.post(
  "/",
  authenticateToken,
  async (req, res, next) => {
    try {
      const {
        lessonId,
        score,
        completed
      } = req.body;

      if (
        !Number.isInteger(lessonId) ||
        lessonId < 1 ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100 ||
        typeof completed !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid progress information"
        });
      }

      const lesson = await pool.query(
        "SELECT id FROM lessons WHERE id = $1 AND is_active = TRUE",
        [lessonId]
      );

      if (!lesson.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found"
        });
      }

      const result = await pool.query(
        `INSERT INTO learning_progress
         (user_id, lesson_id, score, completed, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, lesson_id)
         DO UPDATE SET
           score = EXCLUDED.score,
           completed = learning_progress.completed OR EXCLUDED.completed,
           updated_at = NOW()
         RETURNING *`,
        [req.user.id, lessonId, score, completed]
      );

      res.status(201).json({
        success: true,
        progress: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
