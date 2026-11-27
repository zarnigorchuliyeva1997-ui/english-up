const { pool } = require("../config/database");

// =========================================
// CONSTANTS
// =========================================

const ALLOWED_PLANS = [
  "monthly",
  "quarterly",
  "yearly"
];

const ALLOWED_STATUSES = [
  "pending",
  "paid",
  "cancelled",
  "refunded"
];

const ALLOWED_CURRENCIES = [
  "RUB",
  "UZS",
  "USD"
];

// =========================================
// HELPERS
// =========================================

function normalizePagination(page, limit) {
  const safePage = Math.max(
    1,
    Math.floor(Number(page) || 1)
  );

  const safeLimit = Math.min(
    100,
    Math.max(1, Math.floor(Number(limit) || 20))
  );

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
}

// =========================================
// CREATE PAYMENT (ADMIN, MANUAL)
// =========================================

async function createPayment({
  userId,
  plan,
  amount,
  currency = "RUB",
  method = "manual",
  note = null
} = {}) {
  const parsedUserId = Number(userId);
  const parsedAmount = Number(amount);

  if (
    !Number.isInteger(parsedUserId) ||
    parsedUserId < 1 ||
    typeof plan !== "string" ||
    !ALLOWED_PLANS.includes(plan.trim()) ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    typeof currency !== "string" ||
    !ALLOWED_CURRENCIES.includes(currency.trim()) ||
    typeof method !== "string" ||
    !method.trim() ||
    (note !== null && typeof note !== "string")
  ) {
    throw new Error("Payment details are invalid");
  }

  const userResult = await pool.query(
    `SELECT id
     FROM users
     WHERE id = $1
       AND role = 'student'
       AND is_active = TRUE
     LIMIT 1`,
    [parsedUserId]
  );

  if (!userResult.rows.length) {
    throw new Error("Student not found or inactive");
  }

  const result = await pool.query(
    `INSERT INTO payments (
       user_id,
       plan,
       amount,
       currency,
       method,
       note,
       status
     )
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')
     RETURNING *`,
    [
      parsedUserId,
      plan.trim(),
      parsedAmount,
      currency.trim(),
      method.trim(),
      note && note.trim() ? note.trim() : null
    ]
  );

  return result.rows[0];
}

// =========================================
// UPDATE PAYMENT STATUS (ADMIN)
// =========================================

async function updatePaymentStatus(paymentId, status) {
  const parsedId = Number(paymentId);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new Error("Payment ID is invalid");
  }

  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES.includes(status.trim())
  ) {
    throw new Error("Invalid payment status");
  }

  const normalizedStatus = status.trim();
  const paidAtClause =
    normalizedStatus === "paid" ? "paid_at = NOW()," : "";

  const result = await pool.query(
    `UPDATE payments
     SET status = $2,
         ${paidAtClause}
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [parsedId, normalizedStatus]
  );

  if (!result.rows.length) {
    throw new Error("Payment not found");
  }

  return result.rows[0];
}

// =========================================
// GET PAYMENT BY ID
// =========================================

async function getPaymentById(paymentId) {
  const parsedId = Number(paymentId);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new Error("Payment ID is invalid");
  }

  const result = await pool.query(
    `SELECT
       p.*,
       u.name AS user_name,
       u.email AS user_email
     FROM payments p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [parsedId]
  );

  if (!result.rows.length) {
    throw new Error("Payment not found");
  }

  return result.rows[0];
}

// =========================================
// LIST PAYMENTS (ADMIN)
// =========================================

async function getPayments({ page = 1, limit = 20 } = {}) {
  const pagination = normalizePagination(page, limit);

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM payments`
  );

  const result = await pool.query(
    `SELECT
       p.*,
       u.name AS user_name,
       u.email AS user_email
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC, p.id DESC
     LIMIT $1 OFFSET $2`,
    [pagination.limit, pagination.offset]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: pagination.page,
    limit: pagination.limit
  };
}

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPayments
};
