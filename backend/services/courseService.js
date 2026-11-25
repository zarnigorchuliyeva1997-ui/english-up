
const { pool } = require("../config/database");

// Barcha kurslarni olish
async function getAllCourses({ level, isPublished, isActive } = {}) {
  const conditions = [];
  const values = [];

  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }

  const activeFilter =
    typeof isActive === "boolean" ? isActive : isPublished;

  if (typeof activeFilter === "boolean") {
    values.push(activeFilter);
    conditions.push(`is_active = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT *
     FROM courses
     ${where}
     ORDER BY created_at ASC`,
    values
  );

  return result.rows;
}

// ID orqali kursni olish
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

// Yangi kurs yaratish
async function createCourse({
  title,
  description = "",
  level,
  isActive = false,
  isPublished
}) {
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof level !== "string" ||
    !level.trim()
  ) {
    throw new Error("Course title and level are required");
  }

  const active =
    typeof isPublished === "boolean"
      ? isPublished
      : isActive;

  if (typeof active !== "boolean") {
    throw new Error("Invalid course status");
  }

  const result = await pool.query(
    `INSERT INTO courses
      (title, description, level, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      title.trim(),
      description,
      level.trim(),
      active
    ]
  );

  return result.rows[0];
}

// Kursni yangilash
async function updateCourse(courseId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
    isActive: "is_active",
    isPublished: "is_active"
  };

  const fields = [];
  const values = [];
  const processedColumns = new Set();

  for (const [key, column] of Object.entries(allowedFields)) {
    if (
      data[key] !== undefined &&
      !processedColumns.has(column)
    ) {
      const value = data[key];

      if (
        (key === "title" || key === "level") &&
        (typeof value !== "string" || !value.trim())
      ) {
        throw new Error(`Invalid ${key}`);
      }

      if (
        (key === "isActive" || key === "isPublished") &&
        typeof value !== "boolean"
      ) {
        throw new Error("Invalid course status");
      }

      values.push(
        typeof value === "string" ? value.trim() : value
      );

      fields.push(`${column} = $${values.length}`);
      processedColumns.add(column);
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

// Kursni o'chirish
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

  return {
    success: true,
    id: result.rows[0].id
  };
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
