
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getFileUrl } = require("../services/fileService");

const router = express.Router();

function validId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validAudioKey(value) {
  return typeof value === "string" &&
    value.startsWith("english-up/") &&
    !value.includes("..");
}

function validAudioUrl(value) {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateQuestion(body) {
  const {
    question,
    options,
    correctAnswer,
    explanation,
    points
  } = body || {};

  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    return "Savol matnini kiriting.";
  }

  if (
    !Array.isArray(options) ||
    options.length !== 4 ||
    options.some(
      option => typeof option !== "string" || !option.trim()
    )
  ) {
    return "A, B, C, D variantlarini to‘liq kiriting.";
  }

  if (!["A", "B", "C", "D"].includes(correctAnswer)) {
    return "To‘g‘ri javobni belgilang.";
  }

  if (
    points !== undefined &&
    (!Number.isFinite(Number(points)) ||
      Number(points) <= 0 ||
      Number(points) > 100)
  ) {
    return "Savol balli noto‘g‘ri.";
  }

  if (
    explanation !== undefined &&
    explanation !== null &&
    typeof explanation !== "string"
  ) {
    return "Izoh noto‘g‘ri.";
  }

  return null;
}

async function resolveAudioUrl(lesson) {
  if (lesson.audio_key) {
    return await getFileUrl(lesson.audio_key);
  }

  return lesson.audio_url || null;
}

// =========================================
// ADMIN: ALL LISTENING LESSONS
// GET /api/listening/admin/all
// =========================================

router.get("/admin/all", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         l.id,
         l.course_id,
         l.lesson_id,
         l.title,
         l.description,
         l.level,
         l.audio_key,
         l.audio_url,
         l.transcript,
         l.duration_seconds,
         l.instructions,
         l.is_active,
         l.created_at,
         l.updated_at,
         COUNT(q.id)::INTEGER AS question_count
       FROM listening_lessons l
       LEFT JOIN listening_questions q
         ON q.listening_lesson_id = l.id
       GROUP BY l.id
       ORDER BY l.created_at DESC, l.id DESC`
    );

    const lessons = await Promise.all(
      result.rows.map(async lesson => ({
        ...lesson,
        audio_url: await resolveAudioUrl(lesson)
      }))
    );

    return res.json({
      success: true,
      lessons
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET ACTIVE LISTENING LESSONS
// GET /api/listening
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
         duration_seconds,
         instructions,
         created_at
       FROM listening_lessons
       WHERE is_active = TRUE
       ORDER BY level ASC NULLS LAST, created_at ASC, id ASC`
    );

    return res.json({
      success: true,
      lessons: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET ONE LISTENING LESSON
// GET /api/listening/:id
// =========================================

router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = validId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         level,
         audio_key,
         audio_url,
         transcript,
         duration_seconds,
         instructions,
         created_at
       FROM listening_lessons
       WHERE id = $1
         AND is_active = TRUE`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Listening darsi topilmadi."
      });
    }

    const lesson = result.rows[0];
    const audioUrl = await resolveAudioUrl(lesson);

    const questionsResult = await pool.query(
      `SELECT
         id,
         question,
         options,
         explanation,
         question_order,
         points
       FROM listening_questions
       WHERE listening_lesson_id = $1
       ORDER BY question_order ASC, id ASC`,
      [id]
    );

    return res.json({
      success: true,
      lesson: {
        ...lesson,
        audio_key: undefined,
        audio_url: audioUrl
      },
      questions: questionsResult.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE LISTENING LESSON
// POST /api/listening
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
      audioKey,
      audioUrl,
      transcript,
      durationSeconds,
      instructions,
      isActive
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Dars nomini kiriting."
      });
    }

    if (
      audioKey !== undefined &&
      audioKey !== null &&
      !validAudioKey(audioKey)
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio fayl kaliti noto‘g‘ri."
      });
    }

    if (
      audioUrl !== undefined &&
      audioUrl !== null &&
      !validAudioUrl(audioUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio URL noto‘g‘ri."
      });
    }

    if (!audioKey && !audioUrl) {
      return res.status(400).json({
        success: false,
        message: "Audio fayli kerak."
      });
    }

    if (
      durationSeconds !== undefined &&
      durationSeconds !== null &&
      (!Number.isInteger(durationSeconds) || durationSeconds < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio davomiyligi noto‘g‘ri."
      });
    }

    if (
      isActive !== undefined &&
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Dars holati noto‘g‘ri."
      });
    }

    const textFields = [
      description,
      level,
      transcript,
      instructions
    ];

    if (
      textFields.some(
        value =>
          value !== undefined &&
          value !== null &&
          typeof value !== "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Dars ma'lumotlari noto‘g‘ri."
      });
    }

    const parsedCourseId =
      courseId == null ? null : validId(courseId);

    const parsedLessonId =
      lessonId == null ? null : validId(lessonId);

    if (courseId != null && !parsedCourseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID noto‘g‘ri."
      });
    }

    if (lessonId != null && !parsedLessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `INSERT INTO listening_lessons (
         course_id,
         lesson_id,
         title,
         description,
         level,
         audio_key,
         audio_url,
         transcript,
         duration_seconds,
         instructions,
         is_active
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        parsedCourseId,
        parsedLessonId,
        title.trim(),
        description ?? null,
        level ?? null,
        audioKey ?? null,
        audioUrl ?? null,
        transcript ?? null,
        durationSeconds ?? null,
        instructions ?? null,
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
        message: "Bog‘langan kurs yoki dars topilmadi."
      });
    }

    next(error);
  }
});

// =========================================
// UPDATE LISTENING LESSON
// PATCH /api/listening/:id
// Admin only
// =========================================

router.patch("/:id", auth, admin, async (req, res, next) => {
  try {
    const id = validId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

    const body = req.body || {};

    const updates = {
      course_id: body.courseId,
      lesson_id: body.lessonId,
      title: body.title,
      description: body.description,
      level: body.level,
      audio_key: body.audioKey,
      audio_url: body.audioUrl,
      transcript: body.transcript,
      duration_seconds: body.durationSeconds,
      instructions: body.instructions,
      is_active: body.isActive
    };

    const nullable = new Set([
      "course_id",
      "lesson_id",
      "description",
      "level",
      "audio_key",
      "audio_url",
      "transcript",
      "duration_seconds",
      "instructions"
    ]);

    const fields = [];
    const values = [];

    for (const [column, value] of Object.entries(updates)) {
      if (value === undefined) continue;

      if (value === null && nullable.has(column)) {
        values.push(null);
        fields.push(`${column} = $${values.length}`);
        continue;
      }

      if (column === "course_id" || column === "lesson_id") {
        const parsed = validId(value);

        if (!parsed) {
          return res.status(400).json({
            success: false,
            message: `${column} noto‘g‘ri.`
          });
        }

        values.push(parsed);
      } else if (column === "title") {
        if (
          typeof value !== "string" ||
          !value.trim() ||
          value.trim().length > 200
        ) {
          return res.status(400).json({
            success: false,
            message: "Dars nomi noto‘g‘ri."
          });
        }

        values.push(value.trim());
      } else if (column === "audio_key") {
        if (!validAudioKey(value)) {
          return res.status(400).json({
            success: false,
            message: "Audio fayl kaliti noto‘g‘ri."
          });
        }

        values.push(value);
      } else if (column === "audio_url") {
        if (!validAudioUrl(value)) {
          return res.status(400).json({
            success: false,
            message: "Audio URL noto‘g‘ri."
          });
        }

        values.push(value);
      } else if (column === "duration_seconds") {
        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: "Audio davomiyligi noto‘g‘ri."
          });
        }

        values.push(value);
      } else if (column === "is_active") {
        if (typeof value !== "boolean") {
          return res.status(400).json({
            success: false,
            message: "Dars holati noto‘g‘ri."
          });
        }

        values.push(value);
      } else {
        if (typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: "Dars ma'lumotlari noto‘g‘ri."
          });
        }

        values.push(value);
      }

      fields.push(`${column} = $${values.length}`);
    }

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: "Yangilash uchun ma'lumot kiritilmagan."
      });
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    const result = await pool.query(
      `UPDATE listening_lessons
       SET ${fields.join(", ")}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Dars topilmadi."
      });
    }

    return res.json({
      success: true,
      lesson: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Bog‘langan kurs yoki dars topilmadi."
      });
    }

    next(error);
  }
});

// =========================================
// ADD LISTENING QUESTION
// POST /api/listening/:id/questions
// Admin only
// =========================================

router.post("/:id/questions", auth, admin, async (req, res, next) => {
  try {
    const lessonId = validId(req.params.id);

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Listening darsi ID noto‘g‘ri."
      });
    }

    const validationError = validateQuestion(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const lesson = await pool.query(
      `SELECT id FROM listening_lessons WHERE id = $1`,
      [lessonId]
    );

    if (!lesson.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Listening darsi topilmadi."
      });
    }

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(question_order), 0) + 1 AS next_order
       FROM listening_questions
       WHERE listening_lesson_id = $1`,
      [lessonId]
    );

    const {
      question,
      options,
      correctAnswer,
      explanation,
      points
    } = req.body;

    const result = await pool.query(
      `INSERT INTO listening_questions (
         listening_lesson_id,
         question,
         options,
         correct_answer,
         explanation,
         question_order,
         points
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        lessonId,
        question.trim(),
        JSON.stringify(options.map(option => option.trim())),
        correctAnswer,
        explanation?.trim() || null,
        Number(orderResult.rows[0].next_order),
        points === undefined ? 1 : Number(points)
      ]
    );

    return res.status(201).json({
      success: true,
      question: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// UPDATE LISTENING QUESTION
// PUT /api/listening/:id/questions/:questionId
// Admin only
// =========================================

router.put(
  "/:id/questions/:questionId",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const lessonId = validId(req.params.id);
      const questionId = validId(req.params.questionId);

      if (!lessonId || !questionId) {
        return res.status(400).json({
          success: false,
          message: "ID noto‘g‘ri."
        });
      }

      const validationError = validateQuestion(req.body);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }

      const {
        question,
        options,
        correctAnswer,
        explanation,
        points
      } = req.body;

      const result = await pool.query(
        `UPDATE listening_questions
         SET question = $1,
             options = $2,
             correct_answer = $3,
             explanation = $4,
             points = $5,
             updated_at = NOW()
         WHERE id = $6
           AND listening_lesson_id = $7
         RETURNING *`,
        [
          question.trim(),
          JSON.stringify(options.map(option => option.trim())),
          correctAnswer,
          explanation?.trim() || null,
          points === undefined ? 1 : Number(points),
          questionId,
          lessonId
        ]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Savol topilmadi."
        });
      }

      return res.json({
        success: true,
        question: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// DELETE LISTENING QUESTION
// DELETE /api/listening/:id/questions/:questionId
// Admin only
// =========================================

router.delete(
  "/:id/questions/:questionId",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const lessonId = validId(req.params.id);
      const questionId = validId(req.params.questionId);

      if (!lessonId || !questionId) {
        return res.status(400).json({
          success: false,
          message: "ID noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `DELETE FROM listening_questions
         WHERE id = $1
           AND listening_lesson_id = $2
         RETURNING id`,
        [questionId, lessonId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Savol topilmadi."
        });
      }

      return res.json({
        success: true,
        message: "Savol o‘chirildi."
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// DELETE LISTENING LESSON
// DELETE /api/listening/:id
// Admin only
// =========================================

router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const id = validId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `DELETE FROM listening_lessons
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Dars topilmadi."
      });
    }

    return res.json({
      success: true,
      message: "Listening darsi o‘chirildi."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
