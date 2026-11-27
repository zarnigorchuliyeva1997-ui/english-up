
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");

const {
  getAdminDashboard,
  getStudents
} = require("../services/adminService");

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

// Barcha admin API yo‘llarini himoyalash
router.use(authenticateToken, requireAdmin);

// ADMIN PROFILINI TEKSHIRISH
router.get("/me", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM users
       WHERE id = $1
         AND role = 'admin'
         AND is_active = TRUE
       LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(403).json({
        success: false,
        message: "Admin account is not active"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN DASHBOARD
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

// O‘QUVCHILAR RO‘YXATI
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
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
