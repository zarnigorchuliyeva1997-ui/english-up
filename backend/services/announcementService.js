
const { pool } = require("../config/database");

async function getAnnouncements({ level = null } = {}) {
  const result = await pool.query(
    `SELECT id, title, message, audience, level, created_at
     FROM announcements
     WHERE is_active = TRUE
       AND (
         audience = 'all'
         OR (audience = 'level' AND level = $1)
       )
     ORDER BY created_at DESC`,
    [level]
  );

  return result.rows;
}

async function getAllAnnouncements({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const countResult = await pool.query(
    "SELECT COUNT(*)::int AS total FROM announcements"
  );

  const result = await pool.query(
    `SELECT *
     FROM announcements
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [Number(limit), offset]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function createAnnouncement({
  title,
  message,
  audience = "all",
  level = null
}) {
  if (!["all", "level"].includes(audience)) {
    throw new Error("E'lon auditoriyasi noto'g'ri");
  }

  if (audience === "level" && !level) {
    throw new Error("Daraja tanlanishi kerak");
  }

  const result = await pool.query(
    `INSERT INTO announcements
      (title, message, audience, level, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING *`,
    [title, message, audience, audience === "level" ? level : null]
  );

  return result.rows[0];
}

async function updateAnnouncement(
  announcementId,
  { title, message, audience, level }
) {
  if (audience && !["all", "level"].includes(audience)) {
    throw new Error("E'lon auditoriyasi noto'g'ri");
  }

  if (audience === "level" && !level) {
    throw new Error("Daraja tanlanishi kerak");
  }

  const result = await pool.query(
    `UPDATE announcements
     SET title = COALESCE($1, title),
         message = COALESCE($2, message),
         audience = COALESCE($3, audience),
         level = CASE
           WHEN $3 = 'all' THEN NULL
           WHEN $3 = 'level' THEN $4
           ELSE COALESCE($4, level)
         END,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [
      title ?? null,
      message ?? null,
      audience ?? null,
      level ?? null,
      announcementId
    ]
  );

  if (!result.rows.length) {
    throw new Error("E'lon topilmadi");
  }

  return result.rows[0];
}

async function setAnnouncementStatus(announcementId, isActive) {
  const result = await pool.query(
    `UPDATE announcements
     SET is_active = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [Boolean(isActive), announcementId]
  );

  if (!result.rows.length) {
    throw new Error("E'lon topilmadi");
  }

  return result.rows[0];
}

async function deleteAnnouncement(announcementId) {
  const result = await pool.query(
    `DELETE FROM announcements
     WHERE id = $1
     RETURNING id`,
    [announcementId]
  );

  if (!result.rows.length) {
    throw new Error("E'lon topilmadi");
  }

  return {
    success: true,
    id: result.rows[0].id
  };
}

module.exports = {
  getAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  setAnnouncementStatus,
  deleteAnnouncement
};
