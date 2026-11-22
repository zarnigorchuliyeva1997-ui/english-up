
const { pool } = require("../config/database");

// Bitta foydalanuvchiga bildirishnoma yuborish
async function sendNotification({
  userId,
  title,
  message,
  type = "general",
  link = null
}) {
  if (!userId || !title || !message) {
    throw new Error(
      "Foydalanuvchi, sarlavha va xabar kerak."
    );
  }

  const result = await pool.query(
    `INSERT INTO notifications
     (user_id, title, message, type, link, is_read)
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [
      userId,
      title.trim(),
      message.trim(),
      type,
      link
    ]
  );

  return result.rows[0];
}

// Barcha faol o'quvchilarga bildirishnoma yuborish
async function sendNotificationToAll({
  title,
  message,
  type = "general",
  link = null
}) {
  if (!title || !message) {
    throw new Error("Sarlavha va xabar kerak.");
  }

  const result = await pool.query(
    `INSERT INTO notifications
     (user_id, title, message, type, link, is_read)
     SELECT id, $1, $2, $3, $4, FALSE
     FROM users
     WHERE role = 'student'
       AND is_active = TRUE
     RETURNING id`,
    [
      title.trim(),
      message.trim(),
      type,
      link
    ]
  );

  return {
    sent: result.rowCount
  };
}

// Foydalanuvchining bildirishnomalarini olish
async function getUserNotifications(
  userId,
  limit = 30
) {
  const safeLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 30, 1),
    100
  );

  const result = await pool.query(
    `SELECT *
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, safeLimit]
  );

  return result.rows;
}

// Bildirishnomani o'qilgan deb belgilash
async function markNotificationAsRead(
  notificationId,
  userId
) {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1
       AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );

  return result.rows[0] || null;
}

// O'qilmagan bildirishnomalar soni
async function countUnreadNotifications(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM notifications
     WHERE user_id = $1
       AND is_read = FALSE`,
    [userId]
  );

  return result.rows[0].total;
}

module.exports = {
  sendNotification,
  sendNotificationToAll,
  getUserNotifications,
  markNotificationAsRead,
  countUnreadNotifications
};
