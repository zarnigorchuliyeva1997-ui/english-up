
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Xavfsizlik statistikasi
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

// Xavfsizlik jurnali
router.get("/logs", auth, admin, async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 50, 1),
      100
    );

    const offset = Math.max(
      parseInt(req.query.offset, 10) || 0,
      0
    );

    const result = await pool.query(
      `SELECT
         sl.id,
         sl.user_id,
         u.name AS user_name,
         sl.action,
         sl.details,
         sl.created_at
       FROM security_logs sl
       LEFT JOIN users u ON u.id = sl.user_id
       ORDER BY sl.created_at DESC
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

// Foydalanuvchi akkauntini faolsizlantirish yoki faollashtirish
router.patch(
  "/users/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    const client = await pool.connect();

    try {
      const { is_active } = req.body;

      if (typeof is_active !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "is_active qiymati true yoki false bo'lishi kerak."
        });
      }

      if (String(req.params.id) === String(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: "Admin o'z akkauntini bu bo'limdan o'zgartira olmaydi."
        });
      }

      await client.query("BEGIN");

      const user = await client.query(
        `SELECT id, name, email, role, is_active
         FROM users
         WHERE id = $1
         FOR UPDATE`,
        [req.params.id]
      );

      if (!user.rows.length) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi."
        });
      }

      if (user.rows[0].role === "admin") {
        await client.query("ROLLBACK");

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
        [is_active, req.params.id]
      );

      await client.query(
        `INSERT INTO security_logs
         (user_id, action, details)
         VALUES ($1, $2, $3)`,
        [
          req.user.id,
          is_active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
          `User ID: ${req.params.id}`
        ]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: is_active
          ? "Akkaunt faollashtirildi."
          : "Akkaunt faolsizlantirildi.",
        user: updated.rows[0]
      });
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  }
);

module.exports = router;
