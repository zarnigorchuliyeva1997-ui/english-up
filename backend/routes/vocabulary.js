
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const allowedLevels = [
  "beginner",
  "elementary",
  "pre-intermediate",
  "intermediate",
  "upper-intermediate",
  "ielts"
];

// Faol obunani tekshirish
async function hasActiveSubscription(userId) {
  const result = await pool.query(
    `SELECT id
     FROM subscriptions
     WHERE user_id = $1
       AND status = 'active'
       AND start_date <= CURRENT_DATE
       AND end_date >= CURRENT_DATE
     LIMIT 1`,
    [userId]
  );

  return result.rows.length > 0;
}

// Lug'at so'zlarini olish
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const { level, day } = req.query;

    if (!allowedLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vocabulary level"
      });
    }

    const access = await hasActiveSubscription(req.user.id);

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Active subscription required"
      });
    }

    const values = [level];

    let query = `
      SELECT
        id,
        level,
        day_number,
        word,
        translation,
        pronunciation,
        example
      FROM vocabulary
      WHERE level = $1
    `;

    if (day !== undefined) {
      const dayNumber = Number(day);

      if (!Number.isInteger(dayNumber) || dayNumber < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid day number"
        });
      }

      values.push(dayNumber);
      query += " AND day_number = $2";
    }

    query += " ORDER BY day_number ASC, id ASC";

    const result = await pool.query(query, values);

    res.json({
      success: true,
      words: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Admin yangi so'z qo'shadi
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const {
        level,
        dayNumber,
        word,
        translation,
        pronunciation,
        example
      } = req.body;

      if (
        !allowedLevels.includes(level) ||
        !Number.isInteger(dayNumber) ||
        dayNumber < 1 ||
        typeof word !== "string" ||
        !word.trim() ||
        typeof translation !== "string" ||
        !translation.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid vocabulary information"
        });
      }

      const result = await pool.query(
        `INSERT INTO vocabulary (
           level,
           day_number,
           word,
           translation,
           pronunciation,
           example
         )
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING
           id,
           level,
           day_number,
           word,
           translation,
           pronunciation,
           example,
           created_at`,
        [
          level,
          dayNumber,
          word.trim(),
          translation.trim(),
          typeof pronunciation === "string"
            ? pronunciation.trim()
            : null,
          typeof example === "string"
            ? example.trim()
            : null
        ]
      );

      res.status(201).json({
        success: true,
        word: result.rows[0]
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "This vocabulary word already exists for this level and day."
        });
      }

      next(error);
    }
  }
);

module.exports = router;
