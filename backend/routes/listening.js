
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
      `SELECT id, title, description, level, duration_seconds,
              lesson_order, created_at
       FROM listening_lessons
       WHERE is_active = TRUE
       ORDER BY level, lesson_order`
    );

    res.json({
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

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `SELECT id, title, description, level, audio_key,
              duration_seconds, lesson_order
       FROM listening_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Listening darsi topilmadi."
      });
    }

    const lesson = result.rows[0];
    const audioUrl = await getFileUrl(lesson.audio_key);

    res.json({
      success: true,
      lesson: {
        ...lesson,
        audio_key: undefined,
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
      title,
      description,
      level,
      audioKey,
      durationSeconds,
      lessonOrder
    } = req.body;

    if (
      !title ||
      !level ||
      !audioKey ||
      !audioKey.startsWith("english-up/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Dars nomi, darajasi va audio fayli kerak."
      });
    }

    const result = await pool.query(
      `INSERT INTO listening_lessons
       (title, description, level, audio_key,
        duration_seconds, lesson_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description || null,
        level,
        audioKey,
        Math.max(0, Number(durationSeconds) || 0),
        Math.max(1, Number(lessonOrder) || 1)
      ]
    );

    res.status(201).json({
      success: true,
      lesson: result.rows[0]
    });
  } catch (error) {
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
    const {
      title,
      description,
      level,
      audioKey,
      durationSeconds,
      lessonOrder,
      isActive
    } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Dars ID noto‘g‘ri."
      });
    }

    if (
      audioKey !== undefined &&
      (
        typeof audioKey !== "string" ||
        !audioKey.startsWith("english-up/")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio fayl manzili noto‘g‘ri."
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

    const result = await pool.query(
      `UPDATE listening_lessons
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           level = COALESCE($3, level),
           audio_key = COALESCE($4, audio_key),
           duration_seconds = COALESCE($5, duration_seconds),
           lesson_order = COALESCE($6, lesson_order),
           is_active = COALESCE($7, is_active)
       WHERE id = $8
       RETURNING *`,
      [
        title ?? null,
        description ?? null,
        level ?? null,
        audioKey ?? null,
        durationSeconds === undefined
          ? null
          : Math.max(0, Number(durationSeconds)),
        lessonOrder === undefined
          ? null
          : Math.max(1, Number(lessonOrder)),
        isActive ?? null,
        id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Dars topilmadi."
      });
    }

    res.json({
      success: true,
      lesson: result.rows[0]
    });
  } catch (error) {
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

    if (!Number.isInteger(id) || id < 1) {
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

    res.json({
      success: true,
      message: "Listening darsi o‘chirildi."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
