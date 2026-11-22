
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

// Barcha faol kurslarni ko'rish
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         title,
         level,
         description,
         is_active,
         created_at,
         updated_at
       FROM courses
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Admin barcha kurslarni ko'radi
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           id,
           title,
           level,
           description,
           is_active,
           created_at,
           updated_at
         FROM courses
         ORDER BY id ASC`
      );

      res.json({
        success: true,
        courses: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin yangi kurs qo'shadi
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { title, level, description } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof level !== "string" ||
        !level.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Course title and level are required"
        });
      }

      if (title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: "Course title cannot exceed 200 characters"
        });
      }

      if (level.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: "Course level cannot exceed 50 characters"
        });
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Description must be a string"
        });
      }

      const result = await pool.query(
        `INSERT INTO courses
           (title, level, description)
         VALUES ($1, $2, $3)
         RETURNING
           id,
           title,
           level,
           description,
           is_active,
           created_at,
           updated_at`,
        [
          title.trim(),
          level.trim(),
          description || ""
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

// Admin kurs ma'lumotlarini yangilaydi
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);
      const { title, level, description } = req.body;

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      if (
        title !== undefined &&
        (typeof title !== "string" ||
          !title.trim() ||
          title.trim().length > 200)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid course title"
        });
      }

      if (
        level !== undefined &&
        (typeof level !== "string" ||
          !level.trim() ||
          level.trim().length > 50)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid course level"
        });
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Description must be a string"
        });
      }

      const result = await pool.query(
        `UPDATE courses
         SET
           title = COALESCE($1, title),
           level = COALESCE($2, level),
           description = COALESCE($3, description),
           updated_at = NOW()
         WHERE id = $4
         RETURNING
           id,
           title,
           level,
           description,
           is_active,
           created_at,
           updated_at`,
        [
          title !== undefined ? title.trim() : null,
          level !== undefined ? level.trim() : null,
          description !== undefined ? description : null,
          courseId
        ]
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

// Admin kursni faollashtiradi yoki faolsizlantiradi
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);
      const { isActive } = req.body;

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      const result = await pool.query(
        `UPDATE courses
         SET
           is_active = $1,
           updated_at = NOW()
         WHERE id = $2
         RETURNING
           id,
           title,
           level,
           description,
           is_active,
           created_at,
           updated_at`,
        [isActive, courseId]
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

// Admin kursni o'chiradi
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      const result = await pool.query(
        `DELETE FROM courses
         WHERE id = $1
         RETURNING id`,
        [courseId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      res.json({
        success: true,
        message: "Course deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
