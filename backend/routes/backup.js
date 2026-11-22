
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { uploadBuffer } = require("../services/fileService");

// Backup yaratish uchun tashqi xavfsiz jarayon talab qilinadi.
// Bu endpoint tayyor bo'lmaguncha backup yaratilgan deb ko'rsatmaydi.
router.post("/create", auth, admin, async (req, res) => {
  return res.status(501).json({
    success: false,
    message:
      "Backup yaratish xizmati hali sozlanmagan. PostgreSQL backup jarayoni va S3 saqlash integratsiyasi ulanishi kerak."
  });
});

// Backup ro'yxati
router.get("/", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         file_name,
         storage_key,
         file_size,
         status,
         created_at
       FROM backups
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      backups: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Bitta backup ma'lumoti
router.get("/:id", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         file_name,
         storage_key,
         file_size,
         status,
         created_at
       FROM backups
       WHERE id = $1`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Backup topilmadi."
      });
    }

    res.json({
      success: true,
      backup: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Backup yozuvini o'chirish
// S3 faylini o'chirish integratsiyasi keyin ulanadi.
router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(
      `DELETE FROM backups
       WHERE id = $1
       RETURNING id, storage_key`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Backup topilmadi."
      });
    }

    res.json({
      success: true,
      message:
        "Backup ro'yxatidagi yozuv o'chirildi. S3 faylini o'chirish integratsiyasi alohida ulanadi."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
