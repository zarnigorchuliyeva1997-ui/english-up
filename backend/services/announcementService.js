
const { pool } = require("../config/database");

// E'lonlar ro'yxati
async function getAnnouncements({ isActive } = {}) {
  const values = [];
  let where = "";

  if (typeof isActive === "boolean") {
    values.push(isActive);
    where = "WHERE is_active = $1";
  }

  const result = await pool.query(
    `SELECT *
     FROM announcements
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

// ID orqali e'lonni olish
async function getAnnouncementById(announcementId) {
  const result = await pool.query(
    `SELECT *
     FROM announcements
     WHERE id = $1`,
    [announcementId]
  );

  if (result.rows.length === 0) {
    throw new Error("Announcement not found");
  }

  return result.rows[0];
}

// Yangi e'lon yaratish
async function createAnnouncement({
  title,
  message,
  isActive = false,
  publishAt = null,
  createdBy
}) {
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof message !== "string" ||
    !message.trim() ||
    !createdBy
  ) {
    throw new Error("Title, message and creator are required");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Invalid announcement status");
  }

  if (
    publishAt !== null &&
    Number.isNaN(Date.parse(publishAt))
  ) {
    throw new Error("Invalid publish date");
  }

  const result = await pool.query(
    `INSERT INTO announcements
      (title, message, is_active, publish_at, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      title.trim(),
      message.trim(),
      isActive,
      publishAt,
      createdBy
    ]
  );

  return result.rows[0];
}

// E'lonni yangilash
async function updateAnnouncement(announcementId, data = {}) {
  const allowedFields = {
    title: "title",
    message: "message",
    isActive: "is_active",
    publishAt: "publish_at"
  };

  const fields = [];
  const values = [];

  for (const [key, column] of Object.entries(allowedFields)) {
    if (data[key] !== undefined) {
      const value = data[key];

      if (key === "title" || key === "message") {
        if (typeof value !== "string" || !value.trim()) {
          throw new Error(`Invalid ${key}`);
        }
        values.push(value.trim());
      } else if (key === "isActive") {
        if (typeof value !== "boolean") {
          throw new Error("Invalid announcement status");
        }
        values.push(value);
      } else {
        if (
          value !== null &&
          Number.isNaN(Date.parse(value))
        ) {
          throw new Error("Invalid publish date");
        }
        values.push(value);
      }

      fields.push(`${column} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    throw new Error("No announcement fields provided");
  }

  values.push(announcementId);

  const result = await pool.query(
    `UPDATE announcements
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Announcement not found");
  }

  return result.rows[0];
}

// E'lonni o'chirish
async function deleteAnnouncement(announcementId) {
  const result = await pool.query(
    `DELETE FROM announcements
     WHERE id = $1
     RETURNING id`,
    [announcementId]
  );

  if (result.rows.length === 0) {
    throw new Error("Announcement not found");
  }

  return {
    success: true,
    id: result.rows[0].id
  };
}

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
