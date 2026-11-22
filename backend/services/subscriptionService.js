
const { pool } = require("../config/database");

async function getCurrentSubscription(userId) {
  const result = await pool.query(
    `SELECT id, user_id, plan, status, start_date, end_date
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

async function hasActiveSubscription(userId) {
  const subscription = await getCurrentSubscription(userId);
  return Boolean(subscription);
}

async function activateSubscription({
  userId,
  plan,
  durationDays
}) {
  if (!userId || !plan) {
    throw new Error("User ID and plan are required");
  }

  if (
    !Number.isInteger(durationDays) ||
    durationDays < 1 ||
    durationDays > 365
  ) {
    throw new Error("Invalid subscription duration");
  }

  const result = await pool.query(
    `INSERT INTO subscriptions
       (user_id, plan, status, start_date, end_date)
     VALUES
       ($1, $2, 'active', NOW(),
        NOW() + ($3 * INTERVAL '1 day'))
     RETURNING id, user_id, plan, status, start_date, end_date`,
    [userId, plan, durationDays]
  );

  return result.rows[0];
}

module.exports = {
  getCurrentSubscription,
  hasActiveSubscription,
  activateSubscription
};
