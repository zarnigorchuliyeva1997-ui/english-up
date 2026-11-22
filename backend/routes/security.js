
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// =========================================
// XAVFSIZLIK STATISTIKASI
// GET /api/security/overview
// Admin only
// =========================================

router.get("/overview", auth, admin, async (req, res, next) => {
  try {
    const [users, logs] = await Promise.all([
      pool.query(
        `SELECT
           COUNT(*)::int AS total_users,
           COUNT(*) FILTER (
             WHERE is_active = TRUE
           )::int AS active_users,
           COUNT(*) FILTER (
             WHERE is_active = FALSE
           )::int AS inactive_users
         FROM users`
      ),

      pool.query(
        `SELECT COUNT(*)::int AS total_logs
         FROM security_logs`
      )
    ]);

    res.json({
      success: true,
      security: {
        users: users.rows[0],
        totalLogs: logs.rows[0].total_logs
      }
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// XAVFSIZLIK JURNALI
// GET /api/security/logs
// Admin only
// =========================================

router.get("/logs", auth, admin, async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);

    const limit = Math.min(
      Math.max(parsedLimit || 50, 1),
      100
    );

    const offset = Math.max(parsedOffset || 0, 0);

    const result = await pool.query(
      `SELECT
         sl.id,
         sl.user_id,
         u.name AS user_name,
         sl.event_type,
         sl.description,
         sl.ip_address,
         sl.user_agent,
         sl.created_at
       FROM security_logs sl
       LEFT JOIN users u ON u.id = sl.user_id
       ORDER BY sl.created_at DESC, sl.id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      limit,
      offset,
      logs: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// FOYDALANUVCHI AKKAUNTI HOLATINI O'ZGARTIRISH
// PATCH /api/security/users/:id/status
// Admin only
// =========================================

router.patch(
  "/users/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    let client;
    let transactionStarted = false;

    try {
      const userId = Number(req.params.id);
      const { is_active } = req.body;

      if (
        !Number.isInteger(userId) ||
        userId < 1 ||
        typeof is_active !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "ID yoki is_active qiymati noto'g'ri."
        });
      }

      if (userId === Number(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: "Admin o'z akkauntini bu bo'limdan o'zgartira olmaydi."
        });
      }

      client = await pool.connect();

      await client.query("BEGIN");
      transactionStarted = true;

      const user = await client.query(
        `SELECT id, name, email, role, is_active
         FROM users
         WHERE id = $1
         FOR UPDATE`,
        [userId]
      );

      if (user.rows.length === 0) {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi."
        });
      }

      if (user.rows[0].role === "admin") {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(403).json({
          success: false,
          message: "Admin akkauntini bu bo'limdan o'zgartirib bo'lmaydi."
        });
      }

      const updated = await client.query(
        `UPDATE users
         SET is_active = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING id, name, email, role, is_active`,
        [is_active, userId]
      );

      await client.query(
        `INSERT INTO security_logs
         (user_id, event_type, description, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          req.user.id,
          is_active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
          `User ID: ${userId}`,
          req.ip || null,
          req.get("user-agent") || null
        ]
      );

      await client.query("COMMIT");
      transactionStarted = false;

      res.json({
        success: true,
        message: is_active
          ? "Akkaunt faollashtirildi."
          : "Akkaunt faolsizlantirildi.",
        user: updated.rows[0]
      });
    } catch (error) {
      if (client && transactionStarted) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          // Asosiy xatolik saqlanadi.
        }
      }

      next(error);
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

module.exports = router;
