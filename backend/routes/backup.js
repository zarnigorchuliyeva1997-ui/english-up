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

// =========================================
// HELPERS
// =========================================

function isNotFoundError(error) {
  return (
    typeof error?.message === "string" &&
    error.message.toLowerCase().includes("not found")
  );
}

function isServiceUnavailableError(error) {
  if (!error || typeof error.message !== "string") {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("pg_dump") ||
    message.includes("database configuration") ||
    message.includes("database_url") ||
    message.includes("db_host")
  );
}

// =========================================
// BACKUP YARATISH
// POST /api/backup/create
// =========================================

router.post("/create", async (req, res, next) => {
  try {
    const backup = await createBackup(req.user.id);

    res.status(201).json({
      success: true,
      message: "Backup muvaffaqiyatli yaratildi",
      backup
    });
  } catch (error) {
    if (isServiceUnavailableError(error)) {
      return res.status(503).json({
        success: false,
        message:
          "Backup xizmati mavjud emas. Serverda pg_dump o‘rnatilganini va DB sozlamalarini tekshiring."
      });
    }

    next(error);
  }
});

// =========================================
// BACKUPLAR RO‘YXATI
// GET /api/backup
// =========================================

router.get("/", async (req, res, next) => {
  try {
    const backups = await getBackups();

    res.json({
      success: true,
      backups
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// BACKUPNI O‘CHIRISH
// DELETE /api/backup/:id
// =========================================

router.delete("/:id", async (req, res, next) => {
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
    if (isNotFoundError(error)) {
      return res.status(404).json({
        success: false,
        message: "Backup topilmadi"
      });
    }

    next(error);
  }
});

module.exports = router;
