
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// =========================================
// GET ACTIVE WRITING TASKS
// GET /api/writing
// =========================================

router.get("/", auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         task_type,
         level,
         instructions,
         word_limit,
         created_at
       FROM writing_tasks
       WHERE is_active = TRUE
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      tasks: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET ONE WRITING TASK
// GET /api/writing/:id
// =========================================

router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Topshiriq ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         task_type,
         level,
         instructions,
         word_limit
       FROM writing_tasks
       WHERE id = $1
         AND is_active = TRUE`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Writing topshirig‘i topilmadi."
      });
    }

    res.json({
      success: true,
      task: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE WRITING TASK
// POST /api/writing
// Admin only
// =========================================

router.post("/", auth, admin, async (req, res, next) => {
  try {
    const {
      courseId,
      lessonId,
      title,
      description,
      taskType,
      level,
      instructions,
      wordLimit
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof level !== "string" ||
      !level.trim() ||
      typeof instructions !== "string" ||
      !instructions.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha, daraja va topshiriq matni kerak."
      });
    }

    const parsedCourseId =
      courseId === undefined || courseId === null || courseId === ""
        ? null
        : Number(courseId);

    const parsedLessonId =
      lessonId === undefined || lessonId === null || lessonId === ""
        ? null
        : Number(lessonId);

    const parsedWordLimit =
      wordLimit === undefined || wordLimit === null || wordLimit === ""
        ? 0
        : Number(wordLimit);

    if (
      (parsedCourseId !== null &&
        (!Number.isInteger(parsedCourseId) || parsedCourseId < 1)) ||
      (parsedLessonId !== null &&
        (!Number.isInteger(parsedLessonId) || parsedLessonId < 1)) ||
      !Number.isInteger(parsedWordLimit) ||
      parsedWordLimit < 0 ||
      parsedWordLimit > 10000
    ) {
      return res.status(400).json({
        success: false,
        message: "Topshiriq parametrlari noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `INSERT INTO writing_tasks (
         course_id,
         lesson_id,
         title,
         description,
         task_type,
         level,
         instructions,
         word_limit
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        parsedCourseId,
        parsedLessonId,
        title.trim(),
        description || null,
        taskType || "essay",
        level.trim(),
        instructions.trim(),
        parsedWordLimit
      ]
    );

    res.status(201).json({
      success: true,
      task: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// SUBMIT WRITING
// POST /api/writing/:id/submit
// =========================================

router.post("/:id/submit", auth, async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const { content } = req.body;

    if (
      !Number.isInteger(taskId) ||
      taskId < 1 ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Topshiriq yoki yozilgan matn noto‘g‘ri."
      });
    }

    const cleanContent = content.trim();

    if (cleanContent.length > 30000) {
      return res.status(400).json({
        success: false,
        message: "Matn 30 000 belgidan oshmasligi kerak."
      });
    }

    const task = await pool.query(
      `SELECT id, word_limit
       FROM writing_tasks
       WHERE id = $1
         AND is_active = TRUE`,
      [taskId]
    );

    if (!task.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Writing topshirig‘i topilmadi."
      });
    }

    const wordCount = cleanContent.split(/\s+/).length;
    const wordLimit = Number(task.rows[0].word_limit);

    if (wordLimit > 0 && wordCount > wordLimit) {
      return res.status(400).json({
        success: false,
        message: `Matn ${wordLimit} ta so‘zdan oshmasligi kerak.`,
        wordCount
      });
    }

    const result = await pool.query(
      `INSERT INTO writing_submissions (
         user_id,
         task_id,
         content,
         word_count
       )
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         task_id,
         content,
         word_count,
         status,
         created_at`,
      [req.user.id, taskId, cleanContent, wordCount]
    );

    res.status(201).json({
      success: true,
      message: "Writing topshirig‘i yuborildi.",
      submission: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET MY WRITING SUBMISSIONS
// GET /api/writing/my/submissions
// =========================================

router.get(
  "/my/submissions",
  auth,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           s.id,
           s.task_id,
           t.title,
           s.word_count,
           s.status,
           s.score,
           s.feedback,
           s.created_at,
           s.reviewed_at
         FROM writing_submissions s
         JOIN writing_tasks t ON t.id = s.task_id
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC`,
        [req.user.id]
      );

      res.json({
        success: true,
        submissions: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// GET ALL SUBMISSIONS
// GET /api/writing/admin/submissions
// Admin only
// =========================================

router.get(
  "/admin/submissions",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           s.id,
           s.user_id,
           u.name,
           u.email,
           s.task_id,
           t.title,
           s.content,
           s.word_count,
           s.status,
           s.score,
           s.feedback,
           s.reviewed_by,
           s.reviewed_at,
           s.created_at
         FROM writing_submissions s
         JOIN users u ON u.id = s.user_id
         JOIN writing_tasks t ON t.id = s.task_id
         ORDER BY s.created_at DESC`
      );

      res.json({
        success: true,
        submissions: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// REVIEW WRITING SUBMISSION
// PATCH /api/writing/admin/submissions/:id
// Admin only
// =========================================

router.patch(
  "/admin/submissions/:id",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { score, feedback } = req.body;

      const parsedScore = Number(score);

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        score === undefined ||
        score === null ||
        score === "" ||
        !Number.isFinite(parsedScore) ||
        parsedScore < 0 ||
        parsedScore > 100 ||
        typeof feedback !== "string" ||
        !feedback.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Baho yoki izoh noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE writing_submissions
         SET score = $1,
             feedback = $2,
             status = 'reviewed',
             reviewed_by = $3,
             reviewed_at = NOW(),
             updated_at = NOW()
         WHERE id = $4
         RETURNING
           id,
           score,
           feedback,
           status,
           reviewed_by,
           reviewed_at`,
        [parsedScore, feedback.trim(), req.user.id, id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Topshiriq javobi topilmadi."
        });
      }

      res.json({
        success: true,
        submission: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// ACTIVATE / DEACTIVATE TASK
// PATCH /api/writing/:id/status
// Admin only
// =========================================

router.patch(
  "/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { isActive } = req.body;

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "ID yoki holat noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE writing_tasks
         SET is_active = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING id, title, is_active`,
        [isActive, id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Writing topshirig‘i topilmadi."
        });
      }

      res.json({
        success: true,
        task: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
