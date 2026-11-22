
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const {
  hasActiveSubscription
} = require("../services/subscriptionService");

const allowedLevels = [
  "beginner",
  "elementary",
  "pre-intermediate",
  "intermediate",
  "upper-intermediate",
  "ielts"
];

// Lug'at so'zlarini olish
router.get(
  "/",
  authenticateToken,
  async (req, res, next) => {
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
        SELECT id, level, day_number, word,
               translation, pronunciation, example
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
  }
);

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
        !word ||
        !translation
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid vocabulary information"
        });
      }

      const result = await pool.query(
        `INSERT INTO vocabulary
         (level, day_number, word, translation,
          pronunciation, example)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          level,
          dayNumber,
          word.trim(),
          translation.trim(),
          pronunciation || "",
          example || ""
        ]
      );

      res.status(201).json({
        success: true,
        word: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
