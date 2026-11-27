
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  upload,
  uploadFile,
  deleteFile,
  getFileUrl
} = require("../services/fileService");

// =========================================
// UPLOAD FILE
// POST /api/files/upload
// Admin only
// =========================================

router.post(
  "/upload",
  auth,
  admin,
  (req, res, next) => {
    upload.single("file")(req, res, (error) => {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "Fayl hajmi 100 MB dan oshmasligi kerak."
          });
        }

        if (error.message === "File type is not allowed") {
          return res.status(400).json({
            success: false,
            message: "Bu fayl turiga ruxsat berilmagan."
          });
        }

        return next(error);
      }

      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Yuklash uchun fayl tanlanmagan."
        });
      }

      const folder = req.body?.folder || "media";
      const file = await uploadFile(req.file, folder);

      return res.status(201).json({
        success: true,
        message: "Fayl muvaffaqiyatli yuklandi.",
        file
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// GET TEMPORARY FILE URL
// GET /api/files/url?key=...
// Admin only
// =========================================

router.get(
  "/url",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const { key } = req.query;

      if (typeof key !== "string" || !key.trim()) {
        return res.status(400).json({
          success: false,
          message: "Fayl manzili ko‘rsatilmagan."
        });
      }

      const url = await getFileUrl(key.trim(), 900);

      return res.json({
        success: true,
        url,
        expiresIn: 900
      });
    } catch (error) {
      if (error.message === "Invalid file key") {
        return res.status(400).json({
          success: false,
          message: "Fayl manzili noto‘g‘ri."
        });
      }

      next(error);
    }
  }
);

// =========================================
// DELETE FILE
// DELETE /api/files/delete
// Admin only
// =========================================

router.delete(
  "/delete",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const { key } = req.body || {};

      if (typeof key !== "string" || !key.trim()) {
        return res.status(400).json({
          success: false,
          message: "O‘chiriladigan fayl manzili ko‘rsatilmagan."
        });
      }

      await deleteFile(key.trim());

      return res.json({
        success: true,
        message: "Fayl muvaffaqiyatli o‘chirildi."
      });
    } catch (error) {
      if (error.message === "Invalid file key") {
        return res.status(400).json({
          success: false,
          message: "Fayl manzili noto‘g‘ri."
        });
      }

      next(error);
    }
  }
);

module.exports = router;
