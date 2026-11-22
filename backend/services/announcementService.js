
const { pool } = require("../config/database");

async function getAnnouncements({ isPublished } = {}) {
  const values = [];
  let where = "";

  if (typeof isPublished === "boolean") {
    values.push(isPublished);
    where = "WHERE is_published = $1";
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

async function createAnnouncement({
  title,
  message,
  targetLevel = null,
  isPublished = false,
  createdBy
}) {
  if (!title || !message || !createdBy) {
    throw new Error("Title, message and creator are required");
  }

  const result = await pool.query(
    `INSERT INTO announcements
      (title, message, target_level, is_published, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title.trim(), message, targetLevel, isPublished, createdBy]
  );

  return result.rows[0];
}

async function updateAnnouncement(announcementId, data = {}) {
  const allowedFields = {
    title: "title",
    message: "message",
    targetLevel: "target_level",
    isPublished: "is_published"
  };

  const fields = [];
  const values = [];

  for (const [key, column] of Object.entries(allowedFields)) {
    if (data[key] !== undefined) {
      values.push(data[key]);
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

  return { success: true };
}

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
