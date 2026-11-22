
const { pool } = require("../config/database");

// Xavfsizlik hodisasini jurnalga yozish
async function logSecurityEvent({
  userId = null,
  action,
  details = null,
  ipAddress = null
}) {
  if (
    typeof action !== "string" ||
    !action.trim()
  ) {
    throw new Error("Xavfsizlik hodisasi nomi kerak.");
  }

  const result = await pool.query(
    `INSERT INTO security_logs
     (user_id, action, details, ip_address)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, action, details, ip_address, created_at`,
    [
      userId,
      action.trim(),
      details,
      ipAddress
    ]
  );

  return result.rows[0];
}

// Xavfsizlik jurnalini olish
async function getSecurityLogs({
  limit = 50,
  offset = 0,
  userId = null
} = {}) {
  const safeLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 50, 1),
    100
  );

  const safeOffset = Math.max(
    Number.parseInt(offset, 10) || 0,
    0
  );

  const result = await pool.query(
    `SELECT
       sl.id,
       sl.user_id,
       u.name AS user_name,
       sl.action,
       sl.details,
       sl.ip_address,
       sl.created_at
     FROM security_logs sl
     LEFT JOIN users u ON u.id = sl.user_id
     WHERE ($1::integer IS NULL OR sl.user_id = $1)
     ORDER BY sl.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, safeLimit, safeOffset]
  );

  return result.rows;
}

// Muayyan foydalanuvchi hodisalari soni
async function countUserSecurityEvents(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM security_logs
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0].total;
}

module.exports = {
  logSecurityEvent,
  getSecurityLogs,
  countUserSecurityEvents
};
