
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const {
  getActiveSubscription
} = require("../services/subscriptionService");

// =========================================
// GET COURSE LESSONS
// GET /api/lessons/course/:courseId
// Active subscription required
// =========================================

router.get(
  "/course/:courseId",
  authenticateToken,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.courseId);

      if (!Number.isSafeInteger(courseId) || courseId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      const subscription = await getActiveSubscription(req.user.id);

      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: "Active subscription required"
        });
      }

      const result = await pool.query(
        `SELECT
           l.id,
           l.course_id,
           l.title,
           l.description,
           l.content,
           l.audio_url,
           l.video_url,
           l.pdf_url,
           l.lesson_order,
           l.created_at,
           l.updated_at
         FROM lessons l
         INNER JOIN courses c ON c.id = l.course_id
         WHERE l.course_id = $1
           AND l.is_active = TRUE
           AND c.is_active = TRUE
         ORDER BY l.lesson_order ASC, l.id ASC`,
        [courseId]
      );

      return res.json({
        success: true,
        lessons: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// CREATE LESSON
// POST /api/lessons
// Admin only
// =========================================

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
        pdfUrl,
        lessonOrder,
        isActive
      } = req.body || {};

      const parsedCourseId = Number(courseId);

      if (
        !Number.isSafeInteger(parsedCourseId) ||
        parsedCourseId < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid course ID is required"
        });
      }

      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 200
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid lesson title is required"
        });
      }

      if (
        lessonOrder !== undefined &&
        (!Number.isInteger(lessonOrder) || lessonOrder < 1)
      ) {
        return res.status(400).json({
          success: false,
          message: "Lesson order must be a positive integer"
        });
      }

      if (
        isActive !== undefined &&
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      const optionalFields = [
        description,
        content,
        audioUrl,
        videoUrl,
        pdfUrl
      ];

      if (
        optionalFields.some(
          value => value !== undefined &&
            value !== null &&
            typeof value !== "string"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Lesson fields must be strings"
        });
      }

      const result = await pool.query(
        `INSERT INTO lessons (
           course_id,
           title,
           description,
           content,
           audio_url,
           video_url,
           pdf_url,
           lesson_order,
           is_active
         )
         VALUES (
           $1, $2, $3, $4, $5, $6, $7,
           COALESCE(
             $8,
             (
               SELECT COALESCE(MAX(lesson_order), 0) + 1
               FROM lessons
               WHERE course_id = $1
             )
           ),
           $9
         )
         RETURNING *`,
        [
          parsedCourseId,
          title.trim(),
          description ?? "",
          content ?? "",
          audioUrl ?? null,
          videoUrl ?? null,
          pdfUrl ?? null,
          lessonOrder ?? null,
          isActive ?? false
        ]
      );

      return res.status(201).json({
        success: true,
        lesson: result.rows[0]
      });
    } catch (error) {
      if (error.code === "23503") {
        return res.status(400).json({
          success: false,
          message: "Course not found"
        });
      }

      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "This lesson order already exists in the course"
        });
      }

      next(error);
    }
  }
);

// =========================================
// UPDATE LESSON
// PATCH /api/lessons/:id
// Admin only
// =========================================

router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const lessonId = Number(req.params.id);

      if (!Number.isSafeInteger(lessonId) || lessonId < 1) {
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
        pdfUrl,
        isActive,
        lessonOrder
      } = req.body || {};

      const updates = {
        title,
        description,
        content,
        audio_url: audioUrl,
        video_url: videoUrl,
        pdf_url: pdfUrl,
        is_active: isActive,
        lesson_order: lessonOrder
      };

      if (
        title !== undefined &&
        (
          typeof title !== "string" ||
          !title.trim() ||
          title.trim().length > 200
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid lesson title"
        });
      }

      if (
        lessonOrder !== undefined &&
        (!Number.isInteger(lessonOrder) || lessonOrder < 1)
      ) {
        return res.status(400).json({
          success: false,
          message: "Lesson order must be a positive integer"
        });
      }

      if (
        isActive !== undefined &&
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      const fields = [];
      const values = [];

      for (const [column, value] of Object.entries(updates)) {
        if (value === undefined) {
          continue;
        }

        if (
          column !== "is_active" &&
          column !== "lesson_order" &&
          value !== null &&
          typeof value !== "string"
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid lesson field value"
          });
        }

        values.push(
          column === "title" && typeof value === "string"
            ? value.trim()
            : value
        );

        fields.push(`${column} = $${values.length}`);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No lesson fields provided"
        });
      }

      fields.push("updated_at = NOW()");
      values.push(lessonId);

      const result = await pool.query(
        `UPDATE lessons
         SET ${fields.join(", ")}
         WHERE id = $${values.length}
         RETURNING *`,
        values
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found"
        });
      }

      return res.json({
        success: true,
        lesson: result.rows[0]
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "This lesson order already exists in the course"
        });
      }

      next(error);
    }
  }
);

module.exports = router;
