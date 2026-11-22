const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  createBackup,
  getBackups,
  deleteBackup
} = require("../services/backupService");

router.use(auth, admin);

// BACKUP YARATISH
router.post("/create", async (req, res) => {
  try {
    const backup = await createBackup(req.user.id);

    res.status(201).json({
      success: true,
      message: "Backup muvaffaqiyatli yaratildi",
      backup
    });
  } catch (error) {
    console.error("Backup yaratish xatosi:", error);

    res.status(500).json({
      success: false,
      message: "Backup yaratishda xatolik yuz berdi"
    });
  }
});

// BACKUPLAR RO‘YXATI
router.get("/", async (req, res) => {
  try {
    const backups = await getBackups();

    res.json({
      success: true,
      backups
    });
  } catch (error) {
    console.error("Backup ro‘yxati xatosi:", error);

    res.status(500).json({
      success: false,
      message: "Backuplarni olishda xatolik"
    });
  }
});

// BACKUPNI O‘CHIRISH
router.delete("/:id", async (req, res) => {
  try {
    const backupId = Number(req.params.id);

    if (!Number.isInteger(backupId) || backupId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Backup ID noto‘g‘ri"
      });
    }

    const result = await deleteBackup(backupId);

    res.json({
      success: true,
      message: "Backup muvaffaqiyatli o‘chirildi",
      result
    });
  } catch (error) {
    console.error("Backup o‘chirish xatosi:", error);

    res.status(500).json({
      success: false,
      message: "Backupni o‘chirishda xatolik"
    });
  }
});

module.exports = router;
