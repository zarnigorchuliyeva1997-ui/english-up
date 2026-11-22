
const { pool } = require("../config/database");

async function getUserSubscriptions(userId) {
  const result = await pool.query(
    `SELECT id, user_id, plan, status, start_date,
            end_date, created_at, updated_at
     FROM subscriptions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function getActiveSubscription(userId) {
  const result = await pool.query(
    `SELECT *
     FROM subscriptions
     WHERE user_id = $1
       AND status = 'active'
       AND end_date > NOW()
     ORDER BY end_date DESC
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
}

async function activateSubscription({
  userId,
  plan,
  durationDays
}) {
  const days = Number(durationDays);

  if (!userId || !plan || !Number.isInteger(days) || days < 1 || days > 3650) {
    throw new Error("Subscription details are invalid");
  }

  const userResult = await pool.query(
    `SELECT id
     FROM users
     WHERE id = $1 AND role = 'student' AND is_active = TRUE`,
    [userId]
  );

  if (!userResult.rows.length) {
    throw new Error("Student not found or inactive");
  }

  const result = await pool.query(
    `INSERT INTO subscriptions
      (user_id, plan, status, start_date, end_date)
     VALUES ($1, $2, 'active', NOW(),
             NOW() + ($3::int * INTERVAL '1 day'))
     RETURNING *`,
    [userId, plan, days]
  );

  return result.rows[0];
}

async function updateSubscriptionStatus(subscriptionId, status) {
  const allowedStatuses = ["active", "expired", "cancelled", "pending"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid subscription status");
  }

  const result = await pool.query(
    `UPDATE subscriptions
     SET status = $2
     WHERE id = $1
     RETURNING *`,
    [subscriptionId, status]
  );

  if (!result.rows.length) {
    throw new Error("Subscription not found");
  }

  return result.rows[0];
}

async function getAllSubscriptions({
  page = 1,
  limit = 20
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  const countResult = await pool.query(
    "SELECT COUNT(*)::int AS total FROM subscriptions"
  );

  const result = await pool.query(
    `SELECT s.*, u.name AS user_name, u.email AS user_email
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     ORDER BY s.created_at DESC
     LIMIT $1 OFFSET $2`,
    [safeLimit, offset]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: safePage,
    limit: safeLimit
  };
}

module.exports = {
  getUserSubscriptions,
  getActiveSubscription,
  activateSubscription,
  updateSubscriptionStatus,
  getAllSubscriptions
};
