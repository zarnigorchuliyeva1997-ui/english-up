
const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getStudents
} = require("../services/adminService");

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

router.use(authenticateToken, requireAdmin);

// Admin dashboard
router.get("/dashboard", async (req, res, next) => {
  try {
    const statistics = await getAdminDashboard();

    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    next(error);
  }
});

// O'quvchilar ro'yxati
router.get("/students", async (req, res, next) => {
  try {
    const result = await getStudents({
      page: req.query.page,
      limit: req.query.limit
    });

    res.json({
      success: true,
      students: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
