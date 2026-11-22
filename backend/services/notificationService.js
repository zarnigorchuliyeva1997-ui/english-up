
const { pool } = require("../config/database");

async function createNotification({
  userId,
  title,
  message,
  type = "info"
}) {
  if (!userId || !title || !message) {
    throw new Error("User, title and message are required");
  }

  const allowedTypes = ["info", "success", "warning", "error"];

  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid notification type");
  }

  const result = await pool.query(
    `INSERT INTO notifications
      (user_id, title, message, type, is_read, created_at)
     VALUES ($1, $2, $3, $4, FALSE, NOW())
     RETURNING *`,
    [userId, title, message, type]
  );

  return result.rows[0];
}

async function getUserNotifications(userId, limit = 50) {
  const safeLimit = Math.min(
    100,
    Math.max(1, Number.parseInt(limit, 10) || 50)
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

async function markNotificationAsRead(notificationId, userId) {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Notification not found");
  }

  return result.rows[0];
}

async function markAllNotificationsAsRead(userId) {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );

  return {
    updatedCount: result.rowCount
  };
}

async function deleteNotification(notificationId, userId) {
  const result = await pool.query(
    `DELETE FROM notifications
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [notificationId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Notification not found");
  }

  return { success: true };
}

async function getUnreadCount(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM notifications
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );

  return result.rows[0].count;
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount
};
