
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// O'quvchi uchun faol va e'lon qilish vaqti kelgan e'lonlar
router.get("/", auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         title,
         message,
         is_active,
         publish_at,
         created_at
       FROM announcements
       WHERE is_active = TRUE
         AND (publish_at IS NULL OR publish_at <= NOW())
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
      publish_at = null
    } = req.body || {};

    if (
      typeof title !== "string" ||
      typeof message !== "string" ||
      !title.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "E'lon sarlavhasi va matni kerak."
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha 200 belgidan oshmasligi kerak."
      });
    }

    if (
      publish_at !== null &&
      (
        typeof publish_at !== "string" ||
        Number.isNaN(Date.parse(publish_at))
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "E'lon qilish sanasi noto'g'ri."
      });
    }

    const result = await pool.query(
      `INSERT INTO announcements
        (title, message, is_active, publish_at)
       VALUES ($1, $2, TRUE, $3)
       RETURNING *`,
      [
        title.trim(),
        message.trim(),
        publish_at
      ]
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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "E'lon ID noto'g'ri."
      });
    }

    const {
      title,
      message,
      is_active,
      publish_at
    } = req.body || {};

    const current = await pool.query(
      "SELECT * FROM announcements WHERE id = $1",
      [id]
    );

    if (!current.rows.length) {
      return res.status(404).json({
        success: false,
        message: "E'lon topilmadi."
      });
    }

    const old = current.rows[0];

    if (title !== undefined && typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Sarlavha matn ko'rinishida bo'lishi kerak."
      });
    }

    if (message !== undefined && typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "E'lon matni noto'g'ri."
      });
    }

    const newTitle = title !== undefined ? title.trim() : old.title;
    const newMessage = message !== undefined ? message.trim() : old.message;
    const newStatus = is_active !== undefined ? is_active : old.is_active;
    const newPublishAt = publish_at !== undefined
      ? publish_at
      : old.publish_at;

    if (!newTitle || !newMessage) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha va matn bo'sh bo'lmasligi kerak."
      });
    }

    if (newTitle.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha 200 belgidan oshmasligi kerak."
      });
    }

    if (typeof newStatus !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "E'lon holati noto'g'ri."
      });
    }

    if (
      newPublishAt !== null &&
      (
        typeof newPublishAt !== "string" ||
        Number.isNaN(Date.parse(newPublishAt))
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "E'lon qilish sanasi noto'g'ri."
      });
    }

    const result = await pool.query(
      `UPDATE announcements
       SET title = $1,
           message = $2,
           is_active = $3,
           publish_at = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        newTitle,
        newMessage,
        newStatus,
        newPublishAt,
        id
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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "E'lon ID noto'g'ri."
      });
    }

    const result = await pool.query(
      "DELETE FROM announcements WHERE id = $1 RETURNING id",
      [id]
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
