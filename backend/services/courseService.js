
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getCourses(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, title, description, level, is_active, created_at
     FROM courses
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await pool.query(
    "SELECT COUNT(*) FROM courses"
  );

  return {
    courses: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getActiveCourses() {
  const result = await pool.query(
    `SELECT id, title, description, level
     FROM courses
     WHERE is_active = TRUE
     ORDER BY id ASC`
  );

  return result.rows;
}

async function getCourseById(courseId) {
  const result = await pool.query(
    `SELECT id, title, description, level, is_active, created_at
     FROM courses
     WHERE id = $1
     LIMIT 1`,
    [courseId]
  );

  return result.rows[0] || null;
}

async function createCourse(data) {
  const { title, description, level } = data;

  const result = await pool.query(
    `INSERT INTO courses (title, description, level, is_active)
     VALUES ($1, $2, $3, TRUE)
     RETURNING *`,
    [title, description || null, level]
  );

  return result.rows[0];
}

async function updateCourse(courseId, data) {
  const { title, description, level } = data;

  const result = await pool.query(
    `UPDATE courses
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         level = COALESCE($4, level),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      courseId,
      title ?? null,
      description ?? null,
      level ?? null
    ]
  );

  return result.rows[0] || null;
}

async function setCourseStatus(courseId, isActive) {
  const result = await pool.query(
    `UPDATE courses
     SET is_active = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, level, is_active`,
    [courseId, isActive]
  );

  return result.rows[0] || null;
}

async function deleteCourse(courseId) {
  const result = await pool.query(
    `DELETE FROM courses
     WHERE id = $1
     RETURNING id`,
    [courseId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getCourses,
  getActiveCourses,
  getCourseById,
  createCourse,
  updateCourse,
  setCourseStatus,
  deleteCourse
};
