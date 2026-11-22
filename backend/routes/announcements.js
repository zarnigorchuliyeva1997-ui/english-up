
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// O'quvchi uchun faol e'lonlar
router.get("/", auth, async (req, res, next) => {
  try {
    const userLevel = req.user.level || null;

    const result = await pool.query(
      `SELECT
         id,
         title,
         message,
         audience,
         level,
         created_at
       FROM announcements
       WHERE is_active = TRUE
         AND (
           audience = 'all'
           OR (audience = 'level' AND level = $1)
         )
       ORDER BY created_at DESC`,
      [userLevel]
    );

    res.json({
      success: true,
      announcements: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Admin uchun barcha e'lonlar
router.get("/admin/all", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM announcements
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      announcements: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Yangi e'lon yaratish
router.post("/", auth, admin, async (req, res, next) => {
  try {
    const {
      title,
      message,
      audience = "all",
      level = null
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "E'lon sarlavhasi va matni kerak."
      });
    }

    if (!["all", "level"].includes(audience)) {
      return res.status(400).json({
        success: false,
        message: "E'lon auditoriyasi noto'g'ri."
      });
    }

    if (audience === "level" && !level) {
      return res.status(400).json({
        success: false,
        message: "Darajani tanlash kerak."
      });
    }

    const result = await pool.query(
      `INSERT INTO announcements
       (title, message, audience, level, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING *`,
      [title.trim(), message.trim(), audience, level]
    );

    res.status(201).json({
      success: true,
      message: "E'lon yaratildi.",
      announcement: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// E'lonni tahrirlash
router.patch("/:id", auth, admin, async (req, res, next) => {
  try {
    const { title, message, audience, level, is_active } = req.body;

    const current = await pool.query(
      "SELECT * FROM announcements WHERE id = $1",
      [req.params.id]
    );

    if (!current.rows.length) {
      return res.status(404).json({
        success: false,
        message: "E'lon topilmadi."
      });
    }

    const old = current.rows[0];

    const newTitle = title !== undefined ? title.trim() : old.title;
    const newMessage = message !== undefined ? message.trim() : old.message;
    const newAudience = audience !== undefined ? audience : old.audience;
    const newLevel = level !== undefined ? level : old.level;
    const newStatus = is_active !== undefined ? is_active : old.is_active;

    if (!newTitle || !newMessage) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha va matn bo'sh bo'lmasligi kerak."
      });
    }

    if (!["all", "level"].includes(newAudience)) {
      return res.status(400).json({
        success: false,
        message: "E'lon auditoriyasi noto'g'ri."
      });
    }

    if (newAudience === "level" && !newLevel) {
      return res.status(400).json({
        success: false,
        message: "Darajani tanlash kerak."
      });
    }

    const result = await pool.query(
      `UPDATE announcements
       SET title = $1,
           message = $2,
           audience = $3,
           level = $4,
           is_active = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        newTitle,
        newMessage,
        newAudience,
        newLevel,
        newStatus,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: "E'lon yangilandi.",
      announcement: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// E'lonni o'chirish
router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM announcements WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "E'lon topilmadi."
      });
    }

    res.json({
      success: true,
      message: "E'lon o'chirildi."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
