
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// O'quvchining barcha natijalari
router.get("/mine", auth, async (req, res, next) => {
  try {
    const tests = await pool.query(
      `SELECT
         ta.id,
         'test' AS result_type,
         t.title AS title,
         ta.total_questions,
         ta.correct_answers,
         ta.score,
         ta.created_at
       FROM test_attempts ta
       JOIN tests t ON t.id = ta.test_id
       WHERE ta.user_id = $1
       ORDER BY ta.created_at DESC, ta.id DESC`,
      [req.user.id]
    );

    const readings = await pool.query(
      `SELECT
         ra.id,
         'reading' AS result_type,
         rl.title AS title,
         ra.total_questions,
         ra.correct_answers,
         ra.score,
         ra.created_at
       FROM reading_attempts ra
       JOIN reading_lessons rl
         ON rl.id = ra.reading_lesson_id
       WHERE ra.user_id = $1
       ORDER BY ra.created_at DESC, ra.id DESC`,
      [req.user.id]
    );

    const results = [...tests.rows, ...readings.rows].sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at) ||
        b.id - a.id
    );

    res.json({
      success: true,
      total: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
});

// O'quvchining umumiy statistikasi
router.get("/summary", auth, async (req, res, next) => {
  try {
    const tests = await pool.query(
      `SELECT
         COUNT(*)::int AS total_attempts,
         COALESCE(ROUND(AVG(score)), 0) AS average_score,
         COALESCE(MAX(score), 0) AS best_score
       FROM test_attempts
       WHERE user_id = $1`,
      [req.user.id]
    );

    const readings = await pool.query(
      `SELECT
         COUNT(*)::int AS total_attempts,
         COALESCE(ROUND(AVG(score)), 0) AS average_score,
         COALESCE(MAX(score), 0) AS best_score
       FROM reading_attempts
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      tests: tests.rows[0],
      reading: readings.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Admin barcha o'quvchilar natijalarini ko'radi
router.get("/admin/all", auth, admin, async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);

    const limit = Math.min(
      Math.max(parsedLimit || 50, 1),
      100
    );

    const offset = Math.max(parsedOffset || 0, 0);

    const tests = await pool.query(
      `SELECT
         ta.id,
         u.id AS user_id,
         u.name AS student_name,
         u.email AS student_email,
         t.title AS title,
         'test' AS result_type,
         ta.total_questions,
         ta.correct_answers,
         ta.score,
         ta.created_at
       FROM test_attempts ta
       JOIN users u ON u.id = ta.user_id
       JOIN tests t ON t.id = ta.test_id
       ORDER BY ta.created_at DESC, ta.id DESC`
    );

    const readings = await pool.query(
      `SELECT
         ra.id,
         u.id AS user_id,
         u.name AS student_name,
         u.email AS student_email,
         rl.title AS title,
         'reading' AS result_type,
         ra.total_questions,
         ra.correct_answers,
         ra.score,
         ra.created_at
       FROM reading_attempts ra
       JOIN users u ON u.id = ra.user_id
       JOIN reading_lessons rl
         ON rl.id = ra.reading_lesson_id
       ORDER BY ra.created_at DESC, ra.id DESC`
    );

    const allResults = [...tests.rows, ...readings.rows].sort(
      (a, b) =>
        new Date(b.created_at) - new Date(a.created_at) ||
        b.id - a.id
    );

    const results = allResults.slice(offset, offset + limit);

    res.json({
      success: true,
      total: allResults.length,
      limit,
      offset,
      results
    });
  } catch (error) {
    next(error);
  }
});

// Admin bitta o'quvchining natijalarini ko'radi
router.get(
  "/admin/student/:userId",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.userId);

      if (!Number.isInteger(userId) || userId < 1) {
        return res.status(400).json({
          success: false,
          message: "O'quvchi ID noto'g'ri."
        });
      }

      const student = await pool.query(
        `SELECT id, name, email
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (student.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "O'quvchi topilmadi."
        });
      }

      const tests = await pool.query(
        `SELECT
           ta.id,
           t.title,
           ta.total_questions,
           ta.correct_answers,
           ta.score,
           ta.created_at
         FROM test_attempts ta
         JOIN tests t ON t.id = ta.test_id
         WHERE ta.user_id = $1
         ORDER BY ta.created_at DESC, ta.id DESC`,
        [userId]
      );

      const readings = await pool.query(
        `SELECT
           ra.id,
           rl.title,
           ra.total_questions,
           ra.correct_answers,
           ra.score,
           ra.created_at
         FROM reading_attempts ra
         JOIN reading_lessons rl
           ON rl.id = ra.reading_lesson_id
         WHERE ra.user_id = $1
         ORDER BY ra.created_at DESC, ra.id DESC`,
        [userId]
      );

      res.json({
        success: true,
        student: student.rows[0],
        tests: tests.rows,
        reading: readings.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
