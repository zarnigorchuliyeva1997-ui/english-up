
const { pool } = require("../config/database");

async function logSecurityEvent({
  userId = null,
  action,
  ipAddress = null,
  userAgent = null,
  details = null
}) {
  if (!action || typeof action !== "string") {
    throw new Error("Security action is required");
  }

  const description = details
    ? typeof details === "string"
      ? details
      : JSON.stringify(details)
    : null;

  const result = await pool.query(
    `INSERT INTO security_logs
      (user_id, event_type, ip_address, user_agent, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      userId,
      action.slice(0, 150),
      ipAddress,
      userAgent,
      description
    ]
  );

  return {
    ...result.rows[0],
    action: result.rows[0].event_type,
    details: result.rows[0].description
  };
}

async function getSecurityLogs({
  page = 1,
  limit = 50,
  userId = null,
  action = null
} = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(
    100,
    Math.max(1, Number.parseInt(limit, 10) || 50)
  );

  const offset = (safePage - 1) * safeLimit;

  const conditions = [];
  const values = [];

  if (userId !== null) {
    values.push(userId);
    conditions.push(`user_id = $${values.length}`);
  }

  if (action) {
    values.push(action);
    conditions.push(`event_type = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  values.push(safeLimit);
  const limitPosition = values.length;

  values.push(offset);
  const offsetPosition = values.length;

  const result = await pool.query(
    `SELECT *
     FROM security_logs
     ${where}
     ORDER BY created_at DESC
     LIMIT $${limitPosition}
     OFFSET $${offsetPosition}`,
    values
  );

  return result.rows.map((row) => ({
    ...row,
    action: row.event_type,
    details: row.description
  }));
}

async function deleteSecurityLog(logId) {
  const result = await pool.query(
    `DELETE FROM security_logs
     WHERE id = $1
     RETURNING id`,
    [logId]
  );

  if (result.rows.length === 0) {
    throw new Error("Security log not found");
  }

  return { success: true };
}

async function clearOldSecurityLogs(days = 90) {
  const safeDays = Math.min(
    3650,
    Math.max(30, Number.parseInt(days, 10) || 90)
  );

  const result = await pool.query(
    `DELETE FROM security_logs
     WHERE created_at < NOW() - ($1 * INTERVAL '1 day')
     RETURNING id`,
    [safeDays]
  );

  return {
    deletedCount: result.rowCount
  };
}

module.exports = {
  logSecurityEvent,
  getSecurityLogs,
  deleteSecurityLog,
  clearOldSecurityLogs
};
