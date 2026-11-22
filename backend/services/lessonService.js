
const { pool } = require("../config/database");

async function getLessonsByCourse(courseId, includeUnpublished = false) {
  const conditions = ["course_id = $1"];
  const values = [courseId];

  if (!includeUnpublished) {
    conditions.push("is_published = TRUE");
  }

  const result = await pool.query(
    `SELECT *
     FROM lessons
     WHERE ${conditions.join(" AND ")}
     ORDER BY sort_order ASC, created_at ASC`,
    values
  );

  return result.rows;
}

async function getLessonById(lessonId) {
  const result = await pool.query(
    `SELECT l.*, c.title AS course_title
     FROM lessons l
     JOIN courses c ON c.id = l.course_id
     WHERE l.id = $1`,
    [lessonId]
  );

  if (result.rows.length === 0) {
    throw new Error("Lesson not found");
  }

  return result.rows[0];
}

async function createLesson({
  courseId,
  title,
  description = "",
  content = "",
  sortOrder = 0,
  isPublished = false
}) {
  if (!courseId || !title) {
    throw new Error("Course ID and lesson title are required");
  }

  const result = await pool.query(
    `INSERT INTO lessons
      (course_id, title, description, content, sort_order, is_published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      courseId,
      title.trim(),
      description,
      content,
      sortOrder,
      isPublished
    ]
  );

  return result.rows[0];
}

async function updateLesson(lessonId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    content: "content",
    sortOrder: "sort_order",
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
    throw new Error("No lesson fields provided");
  }

  values.push(lessonId);

  const result = await pool.query(
    `UPDATE lessons
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Lesson not found");
  }

  return result.rows[0];
}

async function deleteLesson(lessonId) {
  const result = await pool.query(
    `DELETE FROM lessons
     WHERE id = $1
     RETURNING id`,
    [lessonId]
  );

  if (result.rows.length === 0) {
    throw new Error("Lesson not found");
  }

  return { success: true };
}

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
