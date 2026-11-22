
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  uploadMiddleware,
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
  uploadMiddleware.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Yuklash uchun fayl tanlanmagan."
        });
      }

      const folder = req.body.folder || "media";

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
// GET /api/files/url
// Admin only
// =========================================

router.get("/url", auth, admin, async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Fayl manzili ko‘rsatilmagan."
      });
    }

    const url = await getFileUrl(key);

    return res.json({
      success: true,
      url,
      expiresIn: 900
    });
  } catch (error) {
    next(error);
  }
});


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
      const { key } = req.body;

      if (!key) {
        return res.status(400).json({
          success: false,
          message: "O‘chiriladigan fayl manzili ko‘rsatilmagan."
        });
      }

      await deleteFile(key);

      return res.json({
        success: true,
        message: "Fayl muvaffaqiyatli o‘chirildi."
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
