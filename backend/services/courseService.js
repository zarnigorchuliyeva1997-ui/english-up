
const { pool } = require("../config/database");

async function getAllCourses({ level, isPublished } = {}) {
  const conditions = [];
  const values = [];

  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }

  if (typeof isPublished === "boolean") {
    values.push(isPublished);
    conditions.push(`is_published = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT *
     FROM courses
     ${where}
     ORDER BY sort_order ASC, created_at ASC`,
    values
  );

  return result.rows;
}

async function getCourseById(courseId) {
  const result = await pool.query(
    `SELECT *
     FROM courses
     WHERE id = $1`,
    [courseId]
  );

  if (result.rows.length === 0) {
    throw new Error("Course not found");
  }

  return result.rows[0];
}

async function createCourse({
  title,
  description = "",
  level,
  sortOrder = 0,
  isPublished = false
}) {
  if (!title || !level) {
    throw new Error("Course title and level are required");
  }

  const result = await pool.query(
    `INSERT INTO courses
      (title, description, level, sort_order, is_published)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title.trim(), description, level, sortOrder, isPublished]
  );

  return result.rows[0];
}

async function updateCourse(courseId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
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
    throw new Error("No course fields provided");
  }

  values.push(courseId);

  const result = await pool.query(
    `UPDATE courses
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Course not found");
  }

  return result.rows[0];
}

async function deleteCourse(courseId) {
  const result = await pool.query(
    `DELETE FROM courses
     WHERE id = $1
     RETURNING id`,
    [courseId]
  );

  if (result.rows.length === 0) {
    throw new Error("Course not found");
  }

  return { success: true };
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
