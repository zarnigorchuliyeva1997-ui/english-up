
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { pool } = require("../config/database");
const generateCode = require("../utils/generateCode");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const allowedPlans = ["monthly", "quarterly", "yearly"];

function hashCode(code) {
  return crypto
    .createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}

// Admin yangi, ma'lum akkauntga biriktirilgan kod yaratadi
router.post(
  "/admin/create",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, plan, durationDays } = req.body;

      if (
        !userId ||
        !allowedPlans.includes(plan) ||
        !Number.isInteger(durationDays) ||
        durationDays < 1 ||
        durationDays > 365
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid activation code details"
        });
      }

      const user = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [userId]
      );

      if (!user.rows.length) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const code = generateCode();
      const codeHash = hashCode(code);

      await pool.query(
        `INSERT INTO activation_codes
         (code_hash, assigned_user_id, plan, duration_days)
         VALUES ($1, $2, $3, $4)`,
        [codeHash, userId, plan, durationDays]
      );

      res.status(201).json({
        success: true,
        message: "Activation code created",
        code
      });
    } catch (error) {
      next(error);
    }
  }
);

// O'quvchi o'z akkauntiga biriktirilgan kodni ishlatadi
router.post(
  "/redeem",
  authenticateToken,
  async (req, res, next) => {
    const client = await pool.connect();

    try {
      const { code } = req.body;

      if (!code || typeof code !== "string") {
        return res.status(400).json({
          success: false,
          message: "Activation code is required"
        });
      }

      await client.query("BEGIN");

      const result = await client.query(
        `SELECT id, assigned_user_id, plan, duration_days,
                used_at, expires_at
         FROM activation_codes
         WHERE code_hash = $1
         FOR UPDATE`,
        [hashCode(code)]
      );

      const activation = result.rows[0];

      if (!activation) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Invalid activation code"
        });
      }

      if (String(activation.assigned_user_id) !== String(req.user.id)) {
        await client.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          message: "This code belongs to another account"
        });
      }

      if (activation.used_at) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: "This code has already been used"
        });
      }

      if (
        activation.expires_at &&
        new Date(activation.expires_at) <= new Date()
      ) {
        await client.query("ROLLBACK");
        return res.status(410).json({
          success: false,
          message: "Activation code has expired"
        });
      }

      await client.query(
        `UPDATE activation_codes
         SET used_at = NOW()
         WHERE id = $1`,
        [activation.id]
      );

      const subscription = await client.query(
        `INSERT INTO subscriptions
         (user_id, plan, status, start_date, end_date)
         VALUES
         ($1, $2, 'active', NOW(),
          NOW() + ($3 * INTERVAL '1 day'))
         RETURNING id, user_id, plan, status, start_date, end_date`,
        [
          req.user.id,
          activation.plan,
          activation.duration_days
        ]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Subscription activated successfully",
        subscription: subscription.rows[0]
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
