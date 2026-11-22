
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");
const {
  hasActiveSubscription
} = require("../services/subscriptionService");

// Kurs darslarini ko'rish
router.get(
  "/course/:courseId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.courseId);

      if (!Number.isInteger(courseId) || courseId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      const access = await hasActiveSubscription(req.user.id);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "Active subscription required"
        });
      }

      const result = await pool.query(
        `SELECT id, course_id, title, description,
                content, audio_url, video_url, sort_order
         FROM lessons
         WHERE course_id = $1 AND is_active = TRUE
         ORDER BY sort_order ASC, id ASC`,
        [courseId]
      );

      res.json({
        success: true,
        lessons: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin yangi dars qo'shadi
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const {
        courseId,
        title,
        description,
        content,
        audioUrl,
        videoUrl,
        sortOrder
      } = req.body;

      if (!courseId || !title) {
        return res.status(400).json({
          success: false,
          message: "Course ID and title are required"
        });
      }

      const result = await pool.query(
        `INSERT INTO lessons
         (course_id, title, description, content,
          audio_url, video_url, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
         RETURNING *`,
        [
          courseId,
          title.trim(),
          description || "",
          content || "",
          audioUrl || null,
          videoUrl || null,
          Number.isInteger(sortOrder) ? sortOrder : 0
        ]
      );

      res.status(201).json({
        success: true,
        lesson: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin darsni tahrirlaydi
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const lessonId = Number(req.params.id);

      if (!Number.isInteger(lessonId) || lessonId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid lesson ID"
        });
      }

      const {
        title,
        description,
        content,
        audioUrl,
        videoUrl,
        isActive,
        sortOrder
      } = req.body;

      const result = await pool.query(
        `UPDATE lessons
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             content = COALESCE($3, content),
             audio_url = COALESCE($4, audio_url),
             video_url = COALESCE($5, video_url),
             is_active = COALESCE($6, is_active),
             sort_order = COALESCE($7, sort_order)
         WHERE id = $8
         RETURNING *`,
        [
          title ?? null,
          description ?? null,
          content ?? null,
          audioUrl ?? null,
          videoUrl ?? null,
          typeof isActive === "boolean" ? isActive : null,
          Number.isInteger(sortOrder) ? sortOrder : null,
          lessonId
        ]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found"
        });
      }

      res.json({
        success: true,
        lesson: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
