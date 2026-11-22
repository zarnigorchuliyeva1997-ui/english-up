
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");

// O'quvchi o'z profilini ko'radi
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         email,
         role,
         level,
         is_active,
         created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found"
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

module.exports = router;
