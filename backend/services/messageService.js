
const { pool } = require("../config/database");

// Foydalanuvchining suhbatlari
async function getUserConversations(userId) {
  const result = await pool.query(
    `SELECT *
     FROM conversations
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId]
  );

  return result.rows;
}

// Barcha suhbatlar (admin)
async function getAllConversations({ status } = {}) {
  let query = `
    SELECT c.*, u.name AS user_name, u.email AS user_email
    FROM conversations c
    JOIN users u ON u.id = c.user_id
  `;

  const values = [];

  if (status) {
    values.push(status);
    query += ` WHERE c.status = $1`;
  }

  query += ` ORDER BY c.updated_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
}

// Yangi suhbat ochish
async function createConversation({ userId, subject, message }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const conversation = await client.query(
      `INSERT INTO conversations (user_id, subject, status)
       VALUES ($1, $2, 'open')
       RETURNING *`,
      [userId, subject]
    );

    const conversationId = conversation.rows[0].id;

    const newMessage = await client.query(
      `INSERT INTO messages (conversation_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [conversationId, userId, message]
    );

    await client.query("COMMIT");

    return {
      conversation: conversation.rows[0],
      message: newMessage.rows[0]
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Suhbat xabarlarini olish
async function getConversationMessages(
  conversationId,
  userId,
  isAdmin = false
) {
  const conversation = await pool.query(
    `SELECT *
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );

  if (!conversation.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  if (
    !isAdmin &&
    String(conversation.rows[0].user_id) !== String(userId)
  ) {
    throw new Error("Bu suhbatga ruxsatingiz yo'q");
  }

  const result = await pool.query(
    `SELECT m.*, u.name AS sender_name, u.role AS sender_role
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [conversationId]
  );

  return result.rows;
}

// Xabar yuborish
async function sendMessage({ conversationId, senderId, message }) {
  const conversation = await pool.query(
    `SELECT *
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );

  if (!conversation.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  if (conversation.rows[0].status === "closed") {
    throw new Error("Bu suhbat yopilgan");
  }

  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, message]
  );

  await pool.query(
    `UPDATE conversations
     SET updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [conversationId]
  );

  return result.rows[0];
}

// Xabarlarni o'qilgan deb belgilash
async function markMessagesAsRead(
  conversationId,
  userId,
  isAdmin = false
) {
  const conversation = await pool.query(
    `SELECT *
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );

  if (!conversation.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  if (
    !isAdmin &&
    String(conversation.rows[0].user_id) !== String(userId)
  ) {
    throw new Error("Bu suhbatga ruxsatingiz yo'q");
  }

  const result = await pool.query(
    `UPDATE messages
     SET is_read = TRUE
     WHERE conversation_id = $1
       AND sender_id <> $2
       AND is_read = FALSE
     RETURNING *`,
    [conversationId, userId]
  );

  return result.rows;
}

// Suhbat holatini o'zgartirish (admin)
async function updateConversationStatus(conversationId, status) {
  const allowedStatuses = ["open", "in_progress", "closed"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Noto'g'ri suhbat holati");
  }

  const result = await pool.query(
    `UPDATE conversations
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, conversationId]
  );

  if (!result.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  return result.rows[0];
}

// Suhbatni yopish
async function closeConversation(
  conversationId,
  userId,
  isAdmin = false
) {
  const conversation = await pool.query(
    `SELECT *
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );

  if (!conversation.rows.length) {
    throw new Error("Suhbat topilmadi");
  }

  if (
    !isAdmin &&
    String(conversation.rows[0].user_id) !== String(userId)
  ) {
    throw new Error("Bu suhbatga ruxsatingiz yo'q");
  }

  return updateConversationStatus(conversationId, "closed");
}

module.exports = {
  getUserConversations,
  getAllConversations,
  createConversation,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  updateConversationStatus,
  closeConversation
};
