
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// =========================================
// GET USER CONVERSATIONS
// GET /api/messages/mine
// =========================================

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
           ORDER BY m.created_at DESC, m.id DESC
           LIMIT 1
         ) AS last_message
       FROM conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      conversations: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE CONVERSATION
// POST /api/messages
// =========================================

router.post("/", auth, async (req, res, next) => {
  let client;

  try {
    const { subject, message } = req.body || {};

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      subject.trim().length > 200 ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Mavzu va xabar matnini to‘g‘ri kiriting."
      });
    }

    client = await pool.connect();

    await client.query("BEGIN");

    const conversation = await client.query(
      `INSERT INTO conversations (
         user_id,
         subject,
         status
       )
       VALUES ($1, $2, 'open')
       RETURNING *`,
      [req.user.id, subject.trim()]
    );

    const newMessage = await client.query(
      `INSERT INTO messages (
         conversation_id,
         sender_id,
         message
       )
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        conversation.rows[0].id,
        req.user.id,
        message.trim()
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      conversation: conversation.rows[0],
      message: newMessage.rows[0]
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
});

// =========================================
// GET ALL CONVERSATIONS
// GET /api/messages/admin/conversations
// Admin only
// =========================================

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
             ORDER BY m.created_at DESC, m.id DESC
             LIMIT 1
           ) AS last_message
         FROM conversations c
         INNER JOIN users u ON u.id = c.user_id
         ORDER BY c.updated_at DESC`
      );

      return res.json({
        success: true,
        conversations: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// GET CONVERSATION MESSAGES
// GET /api/messages/:conversationId/messages
// =========================================

router.get(
  "/:conversationId/messages",
  auth,
  async (req, res, next) => {
    try {
      const conversationId = Number(req.params.conversationId);

      if (
        !Number.isSafeInteger(conversationId) ||
        conversationId < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Murojaat ID noto‘g‘ri."
        });
      }

      const conversation = await pool.query(
        `SELECT
           id,
           user_id,
           subject,
           status,
           created_at,
           updated_at
         FROM conversations
         WHERE id = $1`,
        [conversationId]
      );

      if (!conversation.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      const item = conversation.rows[0];
      const isAdmin = req.user.role === "admin";

      if (
        !isAdmin &&
        String(item.user_id) !== String(req.user.id)
      ) {
        return res.status(403).json({
          success: false,
          message: "Bu murojaatni ko‘rishga ruxsat yo‘q."
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
           m.is_read,
           m.created_at
         FROM messages m
         INNER JOIN users u ON u.id = m.sender_id
         WHERE m.conversation_id = $1
         ORDER BY m.created_at ASC, m.id ASC`,
        [conversationId]
      );

      return res.json({
        success: true,
        conversation: item,
        messages: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// SEND MESSAGE
// POST /api/messages/:conversationId/messages
// =========================================

router.post(
  "/:conversationId/messages",
  auth,
  async (req, res, next) => {
    let client;

    try {
      const conversationId = Number(req.params.conversationId);
      const { message } = req.body || {};

      if (
        !Number.isSafeInteger(conversationId) ||
        conversationId < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Murojaat ID noto‘g‘ri."
        });
      }

      if (
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Xabar matnini kiriting."
        });
      }

      client = await pool.connect();

      await client.query("BEGIN");

      const conversation = await client.query(
        `SELECT id, user_id, status
         FROM conversations
         WHERE id = $1
         FOR UPDATE`,
        [conversationId]
      );

      if (!conversation.rows.length) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      const item = conversation.rows[0];
      const isAdmin = req.user.role === "admin";

      if (
        !isAdmin &&
        String(item.user_id) !== String(req.user.id)
      ) {
        await client.query("ROLLBACK");

        return res.status(403).json({
          success: false,
          message: "Bu suhbatga yozishga ruxsat yo‘q."
        });
      }

      if (item.status === "closed") {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Bu murojaat yopilgan."
        });
      }

      const result = await client.query(
        `INSERT INTO messages (
           conversation_id,
           sender_id,
           message
         )
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          conversationId,
          req.user.id,
          message.trim()
        ]
      );

      await client.query(
        `UPDATE conversations
         SET updated_at = NOW()
         WHERE id = $1`,
        [conversationId]
      );

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: result.rows[0]
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK").catch(() => {});
      }

      next(error);
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// =========================================
// UPDATE CONVERSATION STATUS
// PATCH /api/messages/admin/conversations/:id/status
// Admin only
// =========================================

router.patch(
  "/admin/conversations/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const conversationId = Number(req.params.id);
      const { status } = req.body || {};

      if (
        !Number.isSafeInteger(conversationId) ||
        conversationId < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Murojaat ID noto‘g‘ri."
        });
      }

      if (!["open", "closed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Murojaat holati noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE conversations
         SET
           status = $1,
           updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [status, conversationId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Murojaat topilmadi."
        });
      }

      return res.json({
        success: true,
        conversation: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
