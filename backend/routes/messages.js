
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// O'quvchining murojaatlari
router.get("/mine", auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         c.id,
         c.subject,
         c.status,
         c.created_at,
         c.updated_at,
         (
           SELECT m.message
           FROM messages m
           WHERE m.conversation_id = c.id
           ORDER BY m.created_at DESC
           LIMIT 1
         ) AS last_message
       FROM conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      conversations: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Yangi murojaat yaratish
router.post("/", auth, async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { subject, message } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Mavzu va xabar matnini kiriting."
      });
    }

    await client.query("BEGIN");

    const conversation = await client.query(
      `INSERT INTO conversations
       (user_id, subject, status)
       VALUES ($1, $2, 'open')
       RETURNING *`,
      [req.user.id, subject.trim()]
    );

    const newMessage = await client.query(
      `INSERT INTO messages
       (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        conversation.rows[0].id,
        req.user.id,
        message.trim()
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      conversation: conversation.rows[0],
      message: newMessage.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

// Admin uchun barcha murojaatlar
router.get(
  "/admin/conversations",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT
           c.*,
           u.name AS student_name,
           u.email AS student_email,
           (
             SELECT m.message
             FROM messages m
             WHERE m.conversation_id = c.id
             ORDER BY m.created_at DESC
             LIMIT 1
           ) AS last_message
         FROM conversations c
         JOIN users u ON u.id = c.user_id
         ORDER BY c.updated_at DESC`
      );

      res.json({
        success: true,
        conversations: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// Suhbat xabarlarini ko'rish
router.get(
  "/:conversationId/messages",
  auth,
  async (req, res, next) => {
    try {
      const conversation = await pool.query(
        `SELECT id, user_id, subject, status
         FROM conversations
         WHERE id = $1`,
        [req.params.conversationId]
      );

      if (!conversation.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      const item = conversation.rows[0];
      const isAdmin = req.user.role === "admin";

      if (!isAdmin && String(item.user_id) !== String(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "Bu murojaatni ko'rishga ruxsat yo'q."
        });
      }

      const result = await pool.query(
        `SELECT
           m.id,
           m.conversation_id,
           m.sender_id,
           u.name AS sender_name,
           u.role AS sender_role,
           m.message,
           m.created_at
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC`,
        [req.params.conversationId]
      );

      res.json({
        success: true,
        conversation: item,
        messages: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// Suhbatga javob yuborish
router.post(
  "/:conversationId/messages",
  auth,
  async (req, res, next) => {
    try {
      const { message } = req.body;

      if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: "Xabar matnini kiriting."
        });
      }

      const conversation = await pool.query(
        `SELECT id, user_id, status
         FROM conversations
         WHERE id = $1`,
        [req.params.conversationId]
      );

      if (!conversation.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      const item = conversation.rows[0];
      const isAdmin = req.user.role === "admin";

      if (!isAdmin && String(item.user_id) !== String(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "Bu suhbatga yozishga ruxsat yo'q."
        });
      }

      if (item.status === "closed") {
        return res.status(400).json({
          success: false,
          message: "Bu murojaat yopilgan."
        });
      }

      const result = await pool.query(
        `INSERT INTO messages
         (conversation_id, sender_id, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          item.id,
          req.user.id,
          message.trim()
        ]
      );

      await pool.query(
        `UPDATE conversations
         SET updated_at = NOW(),
             status = 'open'
         WHERE id = $1`,
        [item.id]
      );

      res.status(201).json({
        success: true,
        message: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin murojaat holatini o'zgartiradi
router.patch(
  "/admin/conversations/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!["open", "closed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Murojaat holati noto'g'ri."
        });
      }

      const result = await pool.query(
        `UPDATE conversations
         SET status = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [status, req.params.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      res.json({
        success: true,
        conversation: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
