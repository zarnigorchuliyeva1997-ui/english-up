
const { pool } = require("../config/database");

async function getDashboardStatistics() {
  const result = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM users
       WHERE role = 'student')::int AS total_students,

      (SELECT COUNT(*) FROM users
       WHERE role = 'student' AND is_active = TRUE)::int
       AS active_students,

      (SELECT COUNT(*) FROM subscriptions
       WHERE status = 'active' AND end_date >= CURRENT_DATE)::int
       AS active_subscriptions,

      (SELECT COUNT(*) FROM courses)::int AS total_courses,

      (SELECT COUNT(*) FROM lessons)::int AS total_lessons,

      (SELECT COUNT(*) FROM tests)::int AS total_tests,

      (SELECT COUNT(*) FROM test_attempts)::int
       AS total_test_attempts,

      (SELECT COUNT(*) FROM reading_attempts)::int
       AS total_reading_attempts,

      (SELECT COUNT(*) FROM writing_submissions)::int
       AS total_writing_submissions,

      (SELECT COUNT(*) FROM speaking_submissions)::int
       AS total_speaking_submissions`
  );

  return result.rows[0];
}

async function getRegistrationStatistics(days = 7) {
  const safeDays = Math.min(
    Math.max(Number(days) || 7, 1),
    365
  );

  const result = await pool.query(
    `SELECT
       DATE(created_at) AS registration_date,
       COUNT(*)::int AS registrations
     FROM users
     WHERE role = 'student'
       AND created_at >= CURRENT_DATE - ($1::int - 1)
     GROUP BY DATE(created_at)
     ORDER BY registration_date ASC`,
    [safeDays]
  );

  return result.rows;
}

async function getTestActivityStatistics(days = 7) {
  const safeDays = Math.min(
    Math.max(Number(days) || 7, 1),
    365
  );

  const result = await pool.query(
    `SELECT
       activity_date,
       SUM(attempts)::int AS attempts
     FROM (
       SELECT
         DATE(created_at) AS activity_date,
         COUNT(*) AS attempts
       FROM test_attempts
       WHERE created_at >= CURRENT_DATE - ($1::int - 1)
       GROUP BY DATE(created_at)

       UNION ALL

       SELECT
         DATE(created_at) AS activity_date,
         COUNT(*) AS attempts
       FROM reading_attempts
       WHERE created_at >= CURRENT_DATE - ($1::int - 1)
       GROUP BY DATE(created_at)
     ) activities
     GROUP BY activity_date
     ORDER BY activity_date ASC`,
    [safeDays]
  );

  return result.rows;
}

async function getSubscriptionStatistics() {
  const result = await pool.query(
    `SELECT
       status,
       COUNT(*)::int AS total
     FROM subscriptions
     GROUP BY status
     ORDER BY status`
  );

  return result.rows;
}

async function getCourseStatistics() {
  const result = await pool.query(
    `SELECT
       c.id,
       c.title,
       c.level,
       COUNT(DISTINCT l.id)::int AS total_lessons,
       COUNT(DISTINCT p.user_id)::int AS students_started
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id
     LEFT JOIN learning_progress p ON p.lesson_id = l.id
     GROUP BY c.id, c.title, c.level
     ORDER BY c.id ASC`
  );

  return result.rows;
}

module.exports = {
  getDashboardStatistics,
  getRegistrationStatistics,
  getTestActivityStatistics,
  getSubscriptionStatistics,
  getCourseStatistics
};
