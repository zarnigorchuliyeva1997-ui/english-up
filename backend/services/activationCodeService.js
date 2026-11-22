
const crypto = require("crypto");
const { pool } = require("../config/database");
const { generateCode } = require("../utils/generateCode");

function hashCode(code) {
  return crypto
    .createHash("sha256")
    .update(String(code).trim().toUpperCase())
    .digest("hex");
}

async function createActivationCode({
  userId,
  plan,
  durationDays,
  expiresAt = null
}) {
  const days = Number(durationDays);

  if (!Number.isInteger(days) || days < 1 || days > 3650) {
    throw new Error("Obuna muddati noto'g'ri");
  }

  if (!plan || typeof plan !== "string") {
    throw new Error("Obuna rejasi ko'rsatilmagan");
  }

  const userResult = await pool.query(
    `SELECT id
     FROM users
     WHERE id = $1 AND role = 'student'`,
    [userId]
  );

  if (!userResult.rows.length) {
    throw new Error("O'quvchi topilmadi");
  }

  const code = generateCode();
  const codeHash = hashCode(code);

  const result = await pool.query(
    `INSERT INTO activation_codes
      (code_hash, assigned_user_id, plan, duration_days, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, assigned_user_id, plan,
               duration_days, expires_at, created_at`,
    [codeHash, userId, plan, days, expiresAt]
  );

  return {
    activationCode: code,
    details: result.rows[0]
  };
}

async function redeemActivationCode(userId, code) {
  if (!code || typeof code !== "string") {
    throw new Error("Aktivatsiya kodi kiritilmagan");
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
       WHERE id = $1`,
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

async function getActivationCodes({
  page = 1,
  limit = 20,
  userId = null
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const offset = (safePage - 1) * safeLimit;
  const values = [];
  let where = "";

  if (userId) {
    values.push(userId);
    where = `WHERE assigned_user_id = $${values.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM activation_codes
     ${where}`,
    values
  );

  values.push(safeLimit, offset);

  const result = await pool.query(
    `SELECT
       id,
       assigned_user_id,
       plan,
       duration_days,
       used_at,
       expires_at,
       created_at
     FROM activation_codes
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: safePage,
    limit: safeLimit
  };
}

async function revokeActivationCode(codeId) {
  const result = await pool.query(
    `DELETE FROM activation_codes
     WHERE id = $1 AND used_at IS NULL
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
  redeemActivationCode,
  getActivationCodes,
  revokeActivationCode
};
