
const { pool } = require("../config/database");

// Xavfsiz sahifalash
function normalizePagination(page = 1, limit = 20) {
  const safePage = Math.min(
    Math.max(Math.floor(Number(page) || 1), 1),
    1000000
  );

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

// Admin dashboard
async function getAdminDashboard() {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM users
        WHERE role = 'student')::int AS total_students,

       (SELECT COUNT(*) FROM users
        WHERE role = 'student' AND is_active = TRUE)::int
        AS active_students,

       (SELECT COUNT(*) FROM subscriptions
        WHERE status = 'active'
        AND end_date >= CURRENT_DATE)::int
        AS active_subscriptions,

       (SELECT COUNT(*) FROM courses)::int AS total_courses,

       (SELECT COUNT(*) FROM lessons)::int AS total_lessons,

       (SELECT COUNT(*) FROM tests)::int AS total_tests,

       (SELECT COUNT(*) FROM test_attempts)::int
        AS total_test_attempts,

       (SELECT COUNT(*) FROM writing_submissions
        WHERE status = 'pending')::int
        AS pending_writing_reviews,

       (SELECT COUNT(*) FROM speaking_submissions
        WHERE status = 'pending')::int
        AS pending_speaking_reviews`
  );

  return result.rows[0];
}

// O'quvchilar ro'yxati
async function getStudents({
  page = 1,
  limit = 20,
  search = null,
  level = null,
  status = null
} = {}) {
  const pagination = normalizePagination(page, limit);

  const conditions = ["role = 'student'"];
  const values = [];

  if (search && String(search).trim()) {
    values.push(`%${String(search).trim()}%`);
    conditions.push(
      `(name ILIKE $${values.length}
        OR email ILIKE $${values.length})`
    );
  }

  if (level && String(level).trim()) {
    values.push(String(level).trim());
    conditions.push(`level = $${values.length}`);
  }

  if (status === "active") {
    conditions.push("is_active = TRUE");
  } else if (status === "inactive") {
    conditions.push("is_active = FALSE");
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM users
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
       id,
       name,
       email,
       level,
       is_active,
       created_at
     FROM users
     ${where}
     ORDER BY created_at DESC, id DESC
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    queryValues
  );

  const total = countResult.rows[0].total;

  return {
    items: result.rows,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit)
  };
}

// O'quvchi tafsilotlari
async function getStudentDetails(studentId) {
  const studentResult = await pool.query(
    `SELECT
       id,
       name,
       email,
       level,
       is_active,
       created_at
     FROM users
     WHERE id = $1 AND role = 'student'`,
    [studentId]
  );

  if (!studentResult.rows.length) {
    return null;
  }

  const subscriptionResult = await pool.query(
    `SELECT
       id,
       plan,
       status,
       start_date,
       end_date
     FROM subscriptions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [studentId]
  );

  const progressResult = await pool.query(
    `SELECT
       COUNT(*)::int AS lessons_started,
       COUNT(*) FILTER (
         WHERE completed = TRUE
       )::int AS lessons_completed
     FROM learning_progress
     WHERE user_id = $1`,
    [studentId]
  );

  return {
    student: studentResult.rows[0],
    subscription: subscriptionResult.rows[0] || null,
    progress: progressResult.rows[0]
  };
}

module.exports = {
  getAdminDashboard,
  getStudents,
  getStudentDetails
};
