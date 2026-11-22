
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getFileUrl } = require("../services/fileService");

const router = express.Router();

// =========================================
// GET ACTIVE SPEAKING TASKS
// GET /api/speaking
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
         level,
         instructions,
         time_limit,
         created_at
       FROM speaking_tasks
       WHERE is_active = TRUE
       ORDER BY level NULLS LAST, created_at, id`
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
// GET ONE SPEAKING TASK
// GET /api/speaking/:id
// =========================================

router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Speaking ID noto‘g‘ri."
      });
    }

    const task = await pool.query(
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         level,
         instructions,
         time_limit
       FROM speaking_tasks
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Speaking topshirig‘i topilmadi."
      });
    }

    const questions = await pool.query(
      `SELECT
         id,
         question,
         preparation_seconds,
         speaking_seconds,
         question_order
       FROM speaking_questions
       WHERE speaking_task_id = $1
       ORDER BY question_order, id`,
      [id]
    );

    res.json({
      success: true,
      task: task.rows[0],
      questions: questions.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE SPEAKING TASK
// POST /api/speaking
// Admin only
// =========================================

router.post("/", auth, admin, async (req, res, next) => {
  try {
    const {
      courseId,
      lessonId,
      title,
      description,
      level,
      instructions,
      timeLimit
    } = req.body;

    const validOptionalId = (value) =>
      value === undefined ||
      value === null ||
      (Number.isInteger(value) && value > 0);

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof instructions !== "string" ||
      !instructions.trim() ||
      !validOptionalId(courseId) ||
      !validOptionalId(lessonId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha va topshiriq ko‘rsatmasi kerak. Course ID yoki Lesson ID noto‘g‘ri."
      });
    }

    const parsedTimeLimit =
      timeLimit === undefined || timeLimit === null
        ? null
        : Number(timeLimit);

    if (
      parsedTimeLimit !== null &&
      (!Number.isInteger(parsedTimeLimit) || parsedTimeLimit < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Vaqt chegarasi noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `INSERT INTO speaking_tasks
       (
         course_id,
         lesson_id,
         title,
         description,
         level,
         instructions,
         time_limit
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        courseId || null,
        lessonId || null,
        title.trim(),
        description || null,
        level || null,
        instructions.trim(),
        parsedTimeLimit
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
// ADD SPEAKING QUESTION
// POST /api/speaking/:id/questions
// Admin only
// =========================================

router.post(
  "/:id/questions",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const taskId = Number(req.params.id);

      const {
        question,
        questionOrder,
        preparationSeconds,
        speakingSeconds
      } = req.body;

      if (
        !Number.isInteger(taskId) ||
        taskId < 1 ||
        typeof question !== "string" ||
        !question.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol matni yoki topshiriq ID noto‘g‘ri."
        });
      }

      const order = Number(questionOrder) || 1;
      const preparation = Number(preparationSeconds ?? 30);
      const speaking = Number(speakingSeconds ?? 60);

      if (
        !Number.isInteger(order) ||
        order < 1 ||
        !Number.isInteger(preparation) ||
        preparation < 0 ||
        !Number.isInteger(speaking) ||
        speaking < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol tartibi yoki vaqt qiymatlari noto‘g‘ri."
        });
      }

      const task = await pool.query(
        "SELECT id FROM speaking_tasks WHERE id = $1",
        [taskId]
      );

      if (task.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Speaking topshirig‘i topilmadi."
        });
      }

      const result = await pool.query(
        `INSERT INTO speaking_questions
         (
           speaking_task_id,
           question,
           preparation_seconds,
           speaking_seconds,
           question_order
         )
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          taskId,
          question.trim(),
          preparation,
          speaking,
          order
        ]
      );

      res.status(201).json({
        success: true,
        question: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// SUBMIT SPEAKING AUDIO
// POST /api/speaking/:id/submit
// Audio must already be uploaded to S3
// =========================================

router.post("/:id/submit", auth, async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const { audioKey, durationSeconds } = req.body;

    if (
      !Number.isInteger(taskId) ||
      taskId < 1 ||
      typeof audioKey !== "string" ||
      !audioKey.startsWith("english-up/speaking/") ||
      audioKey.includes("..") ||
      audioKey.includes("\\")
    ) {
      return res.status(400).json({
        success: false,
        message: "Speaking audio fayli yoki ID noto‘g‘ri."
      });
    }

    const duration = Number(durationSeconds);

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 900
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio davomiyligi 1–900 soniya oralig‘ida bo‘lishi kerak."
      });
    }

    const task = await pool.query(
      `SELECT id
       FROM speaking_tasks
       WHERE id = $1 AND is_active = TRUE`,
      [taskId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Speaking topshirig‘i topilmadi."
      });
    }

    const result = await pool.query(
      `INSERT INTO speaking_submissions
       (user_id, task_id, audio_key, duration_seconds)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         task_id,
         duration_seconds,
         status,
         created_at`,
      [req.user.id, taskId, audioKey, duration]
    );

    res.status(201).json({
      success: true,
      message: "Speaking javobi yuborildi.",
      submission: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET MY SPEAKING SUBMISSIONS
// GET /api/speaking/my/submissions
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
           s.duration_seconds,
           s.status,
           s.score,
           s.feedback,
           s.created_at,
           s.reviewed_at
         FROM speaking_submissions s
         JOIN speaking_tasks t ON t.id = s.task_id
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC, s.id DESC`,
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
// GET /api/speaking/admin/submissions
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
           s.audio_key,
           s.duration_seconds,
           s.transcript,
           s.status,
           s.score,
           s.feedback,
           s.reviewed_by,
           s.reviewed_at,
           s.created_at
         FROM speaking_submissions s
         JOIN users u ON u.id = s.user_id
         JOIN speaking_tasks t ON t.id = s.task_id
         ORDER BY s.created_at DESC, s.id DESC`
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
// GET SUBMISSION AUDIO URL
// GET /api/speaking/admin/submissions/:id/audio
// Admin only
// =========================================

router.get(
  "/admin/submissions/:id/audio",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
          success: false,
          message: "Javob ID noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `SELECT audio_key
         FROM speaking_submissions
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Audio javob topilmadi."
        });
      }

      const audioUrl = await getFileUrl(result.rows[0].audio_key);

      res.json({
        success: true,
        audioUrl
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// REVIEW SPEAKING SUBMISSION
// PATCH /api/speaking/admin/submissions/:id
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

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        typeof score !== "number" ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100 ||
        typeof feedback !== "string" ||
        !feedback.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Baho yoki izoh noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE speaking_submissions
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
        [score, feedback.trim(), req.user.id, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Speaking javobi topilmadi."
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
// ACTIVATE / DEACTIVATE SPEAKING TASK
// PATCH /api/speaking/:id/status
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
        `UPDATE speaking_tasks
         SET is_active = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING id, title, is_active`,
        [isActive, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Speaking topshirig‘i topilmadi."
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
