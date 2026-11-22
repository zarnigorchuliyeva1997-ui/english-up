
const { pool } = require("../config/database");

async function createConversation(userId, subject, message) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const conversationResult = await client.query(
      `INSERT INTO conversations
        (user_id, subject, status)
       VALUES ($1, $2, 'open')
       RETURNING *`,
      [userId, subject]
    );

    const conversation = conversationResult.rows[0];

    const messageResult = await client.query(
      `INSERT INTO messages
        (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [conversation.id, userId, message]
    );

    await client.query("COMMIT");

    return {
      conversation,
      message: messageResult.rows[0]
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getUserConversations(userId) {
  const result = await pool.query(
    `SELECT
       c.id,
       c.subject,
       c.status,
       c.created_at,
       c.updated_at,
       (
         SELECT message
         FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC, id DESC
         LIMIT 1
       ) AS last_message
     FROM conversations c
     WHERE c.user_id = $1
     ORDER BY c.updated_at DESC, c.id DESC`,
    [userId]
  );

  return result.rows;
}

async function getAllConversations({
  page = 1,
  limit = 20,
  status = null
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE c.status = $${values.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM conversations c
     ${where}`,
    values
  );

  values.push(Number(limit), offset);

  const result = await pool.query(
    `SELECT
       c.id,
       c.user_id,
       u.name AS student_name,
       u.email AS student_email,
       c.subject,
       c.status,
       c.created_at,
       c.updated_at
     FROM conversations c
     JOIN users u ON u.id = c.user_id
     ${where}
     ORDER BY c.updated_at DESC, c.id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function getConversationMessages(conversationId, userId = null) {
  const values = [conversationId];
  let where = "WHERE m.conversation_id = $1";

  if (userId !== null) {
    values.push(userId);
    where += ` AND c.user_id = $${values.length}`;
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
     JOIN conversations c ON c.id = m.conversation_id
     JOIN users u ON u.id = m.sender_id
     ${where}
     ORDER BY m.created_at ASC, m.id ASC`,
    values
  );

  return result.rows;
}

async function sendMessage(conversationId, senderId, message) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const conversationResult = await client.query(
      `SELECT id, status
       FROM conversations
       WHERE id = $1
       FOR UPDATE`,
      [conversationId]
    );

    if (!conversationResult.rows.length) {
      throw new Error("Suhbat topilmadi");
    }

    if (conversationResult.rows[0].status === "closed") {
      throw new Error("Yopilgan suhbatga xabar yuborib bo'lmaydi");
    }

    const result = await client.query(
      `INSERT INTO messages
        (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [conversationId, senderId, message]
    );

    await client.query(
      `UPDATE conversations
       SET updated_at = NOW()
       WHERE id = $1`,
      [conversationId]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function setConversationStatus(conversationId, status) {
  const allowedStatuses = ["open", "in_progress", "closed"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Suhbat holati noto'g'ri");
  }

  const result = await pool.query(
    `UPDATE conversations
     SET status = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, conversationId]
  );

  if (!result.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  return result.rows[0];
}

module.exports = {
  createConversation,
  getUserConversations,
  getAllConversations,
  getConversationMessages,
  sendMessage,
  setConversationStatus
};
