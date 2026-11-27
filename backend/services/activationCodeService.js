
const crypto = require("crypto");
const { pool } = require("../config/database");

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function hashCode(code) {
  return crypto
    .createHash("sha256")
    .update(String(code).trim().toUpperCase())
    .digest("hex");
}

function generateActivationCode() {
  const part = () => crypto.randomBytes(3).toString("hex").toUpperCase();

  return `EU-${part()}-${part()}-${part()}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function pagination(value, fallback, maximum) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return Math.min(number, maximum);
}

// Bir nechta aktivatsiya kodini bitta tranzaksiyada yaratish
async function createActivationCodes({
  email,
  userId,
  plan,
  durationDays,
  quantity = 1,
  note = ""
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPlan = String(plan || "").trim();
  const days = Number(durationDays);
  const amount = Number(quantity);

  if (!normalizedPlan) {
    throw createError("Obuna rejasi ko‘rsatilmagan.");
  }

  if (!Number.isInteger(days) || days < 1 || days > 3650) {
    throw createError("Obuna muddati noto‘g‘ri.");
  }

  if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
    throw createError("Kodlar soni 1 dan 100 gacha bo‘lishi kerak.");
  }

  if (!normalizedEmail && !userId) {
    throw createError("Email yoki foydalanuvchi ID kiritilishi kerak.");
  }

  const client = await pool.connect();
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    let userResult;

    if (userId) {
      userResult = await client.query(
        `SELECT id, email
         FROM users
         WHERE id = $1
           AND role = 'student'
           AND is_active = TRUE
         FOR UPDATE`,
        [userId]
      );
    } else {
      userResult = await client.query(
        `SELECT id, email
         FROM users
         WHERE email = $1
           AND role = 'student'
           AND is_active = TRUE
         FOR UPDATE`,
        [normalizedEmail]
      );
    }

    if (!userResult.rows.length) {
      throw createError(
        "Faol o‘quvchi topilmadi. Avval foydalanuvchini ro‘yxatdan o‘tkazing.",
        404
      );
    }

    const user = userResult.rows[0];
    const items = [];

    for (let i = 0; i < amount; i++) {
      let code;
      let codeHash;
      let inserted = false;

      // Juda kam ehtimolli kod takrorlanishiga qarshi
      for (let attempt = 0; attempt < 5; attempt++) {
        code = generateActivationCode();
        codeHash = hashCode(code);

        const result = await client.query(
          `INSERT INTO activation_codes (
             code_hash,
             assigned_user_id,
             plan,
             duration_days,
             note
           )
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code_hash) DO NOTHING
           RETURNING id, created_at`,
          [
            codeHash,
            user.id,
            normalizedPlan,
            days,
            note || null
          ]
        );

        if (result.rows.length) {
          items.push({
            id: result.rows[0].id,
            code,
            email: user.email,
            plan: normalizedPlan,
            durationDays: days,
            note: note || "",
            createdAt: result.rows[0].created_at,
            expiresAt: null
          });

          inserted = true;
          break;
        }
      }

      if (!inserted) {
        throw new Error("Noyob aktivatsiya kodini yaratib bo‘lmadi.");
      }
    }

    await client.query("COMMIT");
    transactionStarted = false;

    return items;
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    client.release();
  }
}

// Bitta kod yaratish uchun moslik funksiyasi
async function createActivationCode(options) {
  const items = await createActivationCodes({
    ...options,
    quantity: 1
  });

  return items[0];
}

// Aktivatsiya kodini tekshirish
async function verifyActivationCode(code, email) {
  const normalizedCode = String(code || "").trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedCode || !normalizedEmail) {
    throw createError("Kod va email kiritilishi kerak.");
  }

  const result = await pool.query(
    `SELECT
       ac.id,
       ac.plan,
       ac.duration_days,
       ac.used_at,
       ac.expires_at,
       ac.revoked_at,
       u.email,
       u.is_active,
       u.role
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     WHERE ac.code_hash = $1
     LIMIT 1`,
    [hashCode(normalizedCode)]
  );

  if (!result.rows.length) {
    throw createError("Aktivatsiya kodi noto‘g‘ri.", 404);
  }

  const item = result.rows[0];

  if (item.email.toLowerCase() !== normalizedEmail) {
    throw createError("Bu kod boshqa email manziliga biriktirilgan.");
  }

  if (item.role !== "student" || !item.is_active) {
    throw createError("Foydalanuvchi akkaunti faol emas.");
  }

  if (item.revoked_at) {
    throw createError("Bu aktivatsiya kodi bekor qilingan.");
  }

  if (item.used_at) {
    throw createError("Bu aktivatsiya kodi avval ishlatilgan.");
  }

  if (item.expires_at && new Date(item.expires_at) <= new Date()) {
    throw createError("Aktivatsiya kodining amal qilish muddati tugagan.");
  }

  return {
    valid: true,
    plan: item.plan,
    durationDays: item.duration_days
  };
}

// Aktivatsiya kodini ishlatish va obunani yaratish
async function redeemActivationCode(userId, code) {
  if (!userId) {
    throw createError("Foydalanuvchi aniqlanmadi.", 401);
  }

  const normalizedCode = String(code || "").trim();

  if (!normalizedCode) {
    throw createError("Aktivatsiya kodini kiriting.");
  }

  const client = await pool.connect();
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const codeResult = await client.query(
      `SELECT *
       FROM activation_codes
       WHERE code_hash = $1
       FOR UPDATE`,
      [hashCode(normalizedCode)]
    );

    if (!codeResult.rows.length) {
      throw createError("Aktivatsiya kodi topilmadi.", 404);
    }

    const activation = codeResult.rows[0];

    if (String(activation.assigned_user_id) !== String(userId)) {
      throw createError("Bu kod sizning akkauntingizga biriktirilmagan.");
    }

    if (activation.revoked_at) {
      throw createError("Bu aktivatsiya kodi bekor qilingan.");
    }

    if (activation.used_at) {
      throw createError("Bu kod avval ishlatilgan.");
    }

    if (
      activation.expires_at &&
      new Date(activation.expires_at) <= new Date()
    ) {
      throw createError("Aktivatsiya kodining muddati tugagan.");
    }

    const userResult = await client.query(
      `SELECT id
       FROM users
       WHERE id = $1
         AND role = 'student'
         AND is_active = TRUE
       FOR UPDATE`,
      [userId]
    );

    if (!userResult.rows.length) {
      throw createError("Faol o‘quvchi akkaunti topilmadi.", 404);
    }

    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions (
         user_id,
         plan,
         status,
         start_date,
         end_date
       )
       VALUES (
         $1,
         $2,
         'active',
         NOW(),
         NOW() + ($3 * INTERVAL '1 day')
       )
       RETURNING id, user_id, plan, status, start_date, end_date`,
      [
        userId,
        activation.plan,
        activation.duration_days
      ]
    );

    const updateResult = await client.query(
      `UPDATE activation_codes
       SET used_at = NOW()
       WHERE id = $1
         AND used_at IS NULL
         AND revoked_at IS NULL
       RETURNING id`,
      [activation.id]
    );

    if (!updateResult.rowCount) {
      throw createError("Kodni faollashtirib bo‘lmadi. Qayta urinib ko‘ring.");
    }

    await client.query("COMMIT");
    transactionStarted = false;

    return subscriptionResult.rows[0];
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    client.release();
  }
}

// Admin: kodlar ro‘yxati va statistika
async function getActivationCodes({
  page = 1,
  limit = 100,
  search = "",
  status = "",
  plan = ""
} = {}) {
  const currentPage = pagination(page, 1, 1000000);
  const pageSize = pagination(limit, 100, 200);
  const offset = (currentPage - 1) * pageSize;

  const conditions = [];
  const values = [];

  const addCondition = (sql, value) => {
    values.push(value);
    conditions.push(sql.replace("?", `$${values.length}`));
  };

  if (search) {
    const term = `%${String(search).trim()}%`;
    values.push(term);

    const index = values.length;

    conditions.push(
      `(u.email ILIKE $${index} OR ac.id::text ILIKE $${index})`
    );
  }

  if (plan) {
    addCondition("ac.plan = ?", String(plan));
  }

  if (status === "unused") {
    conditions.push("ac.used_at IS NULL AND ac.revoked_at IS NULL");
  } else if (status === "used") {
    conditions.push("ac.used_at IS NOT NULL");
  } else if (status === "cancelled" || status === "revoked") {
    conditions.push("ac.revoked_at IS NOT NULL");
  }

  const whereSQL = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     ${whereSQL}`,
    values
  );

  const itemsValues = [...values, pageSize, offset];
  const limitIndex = values.length + 1;
  const offsetIndex = values.length + 2;

  const itemsResult = await pool.query(
    `SELECT
       ac.id,
       u.email,
       ac.plan,
       ac.duration_days,
       ac.note,
       ac.used_at,
       ac.revoked_at,
       ac.expires_at,
       ac.created_at,
       CASE
         WHEN ac.revoked_at IS NOT NULL THEN 'cancelled'
         WHEN ac.used_at IS NOT NULL THEN 'used'
         ELSE 'unused'
       END AS status
     FROM activation_codes ac
     INNER JOIN users u ON u.id = ac.assigned_user_id
     ${whereSQL}
     ORDER BY ac.created_at DESC, ac.id DESC
     LIMIT $${limitIndex}
     OFFSET $${offsetIndex}`,
    itemsValues
  );

  const statsResult = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (
         WHERE used_at IS NULL AND revoked_at IS NULL
       )::int AS unused,
       COUNT(*) FILTER (
         WHERE used_at IS NOT NULL
       )::int AS used,
       COUNT(*) FILTER (
         WHERE revoked_at IS NOT NULL
       )::int AS cancelled
     FROM activation_codes`
  );

  return {
    items: itemsResult.rows,
    total: countResult.rows[0].total,
    page: currentPage,
    limit: pageSize,
    totalPages: Math.ceil(countResult.rows[0].total / pageSize),
    stats: statsResult.rows[0]
  };
}

// Admin: kodni tarixni saqlagan holda bekor qilish
async function revokeActivationCode(codeId) {
  const result = await pool.query(
    `UPDATE activation_codes
     SET revoked_at = NOW()
     WHERE id = $1
       AND used_at IS NULL
       AND revoked_at IS NULL
     RETURNING id, revoked_at`,
    [codeId]
  );

  if (!result.rows.length) {
    const existing = await pool.query(
      `SELECT id, used_at, revoked_at
       FROM activation_codes
       WHERE id = $1`,
      [codeId]
    );

    if (!existing.rows.length) {
      throw createError("Aktivatsiya kodi topilmadi.", 404);
    }

    if (existing.rows[0].used_at) {
      throw createError("Ishlatilgan kodni bekor qilib bo‘lmaydi.");
    }

    throw createError("Bu kod avval bekor qilingan.");
  }

  return result.rows[0];
}

module.exports = {
  createActivationCode,
  createActivationCodes,
  verifyActivationCode,
  redeemActivationCode,
  getActivationCodes,
  revokeActivationCode
};
