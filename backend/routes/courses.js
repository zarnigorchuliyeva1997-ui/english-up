
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

// Barcha faol kurslarni ko'rish
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, level, description, is_active
       FROM courses
       WHERE is_active = TRUE
       ORDER BY sort_order ASC, id ASC`
    );

    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Admin yangi kurs qo'shadi
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { title, level, description, sortOrder } = req.body;

      if (!title || !level) {
        return res.status(400).json({
          success: false,
          message: "Course title and level are required"
        });
      }

      const result = await pool.query(
        `INSERT INTO courses
         (title, level, description, sort_order, is_active)
         VALUES ($1, $2, $3, $4, TRUE)
         RETURNING *`,
        [
          title.trim(),
          level.trim(),
          description || "",
          Number.isInteger(sortOrder) ? sortOrder : 0
        ]
      );

      res.status(201).json({
        success: true,
        course: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin kursni faolsizlantiradi
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      const result = await pool.query(
        `UPDATE courses
         SET is_active = $1
         WHERE id = $2
         RETURNING *`,
        [isActive, req.params.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      res.json({
        success: true,
        course: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
