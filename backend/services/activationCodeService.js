
const crypto = require("crypto");
const { pool } = require("../config/database");
const { generateCode } = require("../utils/generateCode");

function hashCode(code) {
  return crypto
    .createHash("sha256")
    .update(String(code).trim().toUpperCase())
    .digest("hex");
}

function normalizePagination(page = 1, limit = 20) {
  const safePage = Math.max(Math.floor(Number(page) || 1), 1);
  const safeLimit = Math.min(
    Math.max(Math.floor(Number(limit) || 20), 1),
    100
  );

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
}

// Admin: Gmail yoki userId orqali aktivatsiya kodi yaratish
async function createActivationCode({
  email = null,
  userId = null,
  plan,
  durationDays,
  expiresAt = null
}) {
  const days = Number(durationDays);

  if (!Number.isInteger(days) || days < 1 || days > 3650) {
    throw new Error("Obuna muddati noto'g'ri");
  }

  if (
    typeof plan !== "string" ||
    !plan.trim() ||
    plan.trim().length > 100
  ) {
    throw new Error("Obuna rejasi noto'g'ri");
  }

  if (expiresAt !== null && Number.isNaN(Date.parse(expiresAt))) {
    throw new Error("Kodning amal qilish sanasi noto'g'ri");
  }

  if (!userId && !email) {
    throw new Error("O'quvchi email manzili ko'rsatilmagan");
  }

  let userResult;

  if (userId) {
    userResult = await pool.query(
      `SELECT id, email
       FROM users
       WHERE id = $1
         AND role = 'student'
         AND is_active = TRUE`,
      [userId]
    );
  } else {
    const normalizedEmail = String(email).trim().toLowerCase();

    userResult = await pool.query(
      `SELECT id, email
       FROM users
       WHERE LOWER(email) = $1
         AND role = 'student'
         AND is_active = TRUE`,
      [normalizedEmail]
    );
  }

  if (!userResult.rows.length) {
    throw new Error("O'quvchi topilmadi");
  }

  const user = userResult.rows[0];
  const code = generateCode();

  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Aktivatsiya kodi yaratilmadi");
  }

  const codeHash = hashCode(code);

  const result = await pool.query(
    `INSERT INTO activation_codes
      (code_hash, assigned_user_id, plan, duration_days, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, assigned_user_id, plan,
               duration_days, expires_at, created_at`,
    [codeHash, user.id, plan.trim(), days, expiresAt]
  );

  return {
    activationCode: code,
    email: user.email,
    details: result.rows[0]
  };
}

// O'quvchi emaili va kod mosligini tekshirish
async function verifyActivationCode(code, email) {
  if (
    typeof code !== "string" ||
    !code.trim() ||
    code.trim().length > 100
  ) {
    throw new Error("Aktivatsiya kodi noto'g'ri");
  }

  if (
    typeof email !== "string" ||
    !email.trim()
  ) {
    throw new Error("Email manzili kiritilmagan");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `SELECT
       ac.id,
       ac.plan,
       ac.duration_days,
       ac.used_at,
       ac.expires_at,
       u.email
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     WHERE ac.code_hash = $1
       AND LOWER(u.email) = $2
       AND u.role = 'student'
       AND u.is_active = TRUE`,
    [hashCode(code), normalizedEmail]
  );

  if (!result.rows.length) {
    throw new Error("Aktivatsiya kodi noto'g'ri");
  }

  const activation = result.rows[0];

  if (activation.used_at) {
    throw new Error("Bu kod avval ishlatilgan");
  }

  if (
    activation.expires_at &&
    new Date(activation.expires_at) <= new Date()
  ) {
    throw new Error("Aktivatsiya kodining muddati tugagan");
  }

  return {
    valid: true,
    plan: activation.plan,
    durationDays: activation.duration_days
  };
}

// O'quvchi: o'z kodini ishlatish
async function redeemActivationCode(userId, code) {
  if (!userId) {
    throw new Error("Foydalanuvchi aniqlanmadi");
  }

  if (
    typeof code !== "string" ||
    !code.trim() ||
    code.trim().length > 100
  ) {
    throw new Error("Aktivatsiya kodi noto'g'ri");
  }

  const codeHash = hashCode(code);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const codeResult = await client.query(
      `SELECT *
       FROM activation_codes
       WHERE code_hash = $1
       FOR UPDATE`,
      [codeHash]
    );

    if (!codeResult.rows.length) {
      throw new Error("Aktivatsiya kodi noto'g'ri");
    }

    const activation = codeResult.rows[0];

    if (String(activation.assigned_user_id) !== String(userId)) {
      throw new Error("Bu kod boshqa foydalanuvchiga biriktirilgan");
    }

    if (activation.used_at) {
      throw new Error("Bu kod avval ishlatilgan");
    }

    if (
      activation.expires_at &&
      new Date(activation.expires_at) <= new Date()
    ) {
      throw new Error("Aktivatsiya kodining muddati tugagan");
    }

    const userResult = await client.query(
      `SELECT id
       FROM users
       WHERE id = $1
         AND role = 'student'
         AND is_active = TRUE`,
      [userId]
    );

    if (!userResult.rows.length) {
      throw new Error("Faol o'quvchi akkaunti topilmadi");
    }

    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions
        (user_id, plan, status, start_date, end_date)
       VALUES (
         $1,
         $2,
         'active',
         NOW(),
         NOW() + ($3::int * INTERVAL '1 day')
       )
       RETURNING *`,
      [
        userId,
        activation.plan,
        activation.duration_days
      ]
    );

    await client.query(
      `UPDATE activation_codes
       SET used_at = NOW()
       WHERE id = $1
         AND used_at IS NULL`,
      [activation.id]
    );

    await client.query("COMMIT");

    return {
      success: true,
      subscription: subscriptionResult.rows[0]
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Admin: kodlar ro'yxati
async function getActivationCodes({
  page = 1,
  limit = 100,
  search = "",
  status = "all",
  plan = "all"
} = {}) {
  const pagination = normalizePagination(page, limit);

  const conditions = [];
  const values = [];

  if (search && String(search).trim()) {
    values.push(`%${String(search).trim().toLowerCase()}%`);
    conditions.push(
      `(LOWER(u.email) LIKE $${values.length} OR CAST(ac.id AS TEXT) LIKE $${values.length})`
    );
  }

  if (status === "unused") {
    conditions.push("ac.used_at IS NULL");
  } else if (status === "used") {
    conditions.push("ac.used_at IS NOT NULL");
  }

  if (plan && plan !== "all") {
    values.push(String(plan));
    conditions.push(`ac.plan = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     ${where}`,
    values
  );

  const queryValues = [
    ...values,
    pagination.limit,
    pagination.offset
  ];

  const result = await pool.query(
    `SELECT
       ac.id,
       u.email,
       ac.assigned_user_id,
       ac.plan,
       ac.duration_days,
       ac.used_at,
       ac.expires_at,
       ac.created_at
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     ${where}
     ORDER BY ac.created_at DESC
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    queryValues
  );

  const total = countResult.rows[0].total;

  return {
    items: result.rows.map(item => ({
      ...item,
      status: item.used_at ? "used" : "unused"
    })),
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit)
  };
}

// Admin: ishlatilmagan kodni bekor qilish
async function revokeActivationCode(codeId) {
  if (!codeId) {
    throw new Error("Kod ID ko'rsatilmagan");
  }

  const result = await pool.query(
    `DELETE FROM activation_codes
     WHERE id = $1
       AND used_at IS NULL
     RETURNING id`,
    [codeId]
  );

  if (!result.rows.length) {
    throw new Error(
      "Kod topilmadi yoki u allaqachon ishlatilgan"
    );
  }

  return {
    success: true,
    id: result.rows[0].id
  };
}

module.exports = {
  createActivationCode,
  verifyActivationCode,
  redeemActivationCode,
  getActivationCodes,
  revokeActivationCode
};
