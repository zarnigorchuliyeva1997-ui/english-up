
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getFileUrl } = require("../services/fileService");

const router = express.Router();

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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
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

    let audioUrl = lesson.audio_url;

    if (lesson.audio_key) {
      audioUrl = await getFileUrl(lesson.audio_key);
    }

    delete lesson.audio_key;
    delete lesson.audio_url;

    return res.json({
      success: true,
      lesson: {
        ...lesson,
        audio_url: audioUrl
      }
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
        message: "Dars nomi kiritilishi kerak."
      });
    }

    if (
      audioKey !== undefined &&
      audioKey !== null &&
      (
        typeof audioKey !== "string" ||
        !audioKey.startsWith("english-up/") ||
        audioKey.includes("..")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio fayl manzili noto‘g‘ri."
      });
    }

    if (
      audioUrl !== undefined &&
      audioUrl !== null &&
      typeof audioUrl !== "string"
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
      (
        !Number.isInteger(durationSeconds) ||
        durationSeconds < 0
      )
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

    const optionalTextFields = [
      description,
      level,
      transcript,
      instructions
    ];

    if (
      optionalTextFields.some(
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
      courseId === undefined || courseId === null
        ? null
        : Number(courseId);

    const parsedLessonId =
      lessonId === undefined || lessonId === null
        ? null
        : Number(lessonId);

    if (
      parsedCourseId !== null &&
      (!Number.isSafeInteger(parsedCourseId) || parsedCourseId < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Course ID noto‘g‘ri."
      });
    }

    if (
      parsedLessonId !== null &&
      (!Number.isSafeInteger(parsedLessonId) || parsedLessonId < 1)
    ) {
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
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

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

    const updates = {
      course_id: courseId,
      lesson_id: lessonId,
      title,
      description,
      level,
      audio_key: audioKey,
      audio_url: audioUrl,
      transcript,
      duration_seconds: durationSeconds,
      instructions,
      is_active: isActive
    };

    const nullableFields = new Set([
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
      if (value === undefined) {
        continue;
      }

      if (value === null && nullableFields.has(column)) {
        values.push(null);
        fields.push(`${column} = $${values.length}`);
        continue;
      }

      if (column === "course_id" || column === "lesson_id") {
        const parsedId = Number(value);

        if (!Number.isSafeInteger(parsedId) || parsedId < 1) {
          return res.status(400).json({
            success: false,
            message: `${column} noto‘g‘ri.`
          });
        }

        values.push(parsedId);
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
        if (
          typeof value !== "string" ||
          !value.startsWith("english-up/") ||
          value.includes("..")
        ) {
          return res.status(400).json({
            success: false,
            message: "Audio fayl manzili noto‘g‘ri."
          });
        }

        values.push(value);
      } else if (column === "audio_url") {
        if (typeof value !== "string") {
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
// DELETE LISTENING LESSON
// DELETE /api/listening/:id
// Admin only
// =========================================

router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
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
