
const { pool } = require("../config/database");

async function getMyResults(userId, { page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const result = await pool.query(
    `SELECT *
     FROM (
       SELECT
         'test' AS result_type,
         a.id,
         a.user_id,
         a.test_id AS item_id,
         t.title AS item_title,
         a.score,
         a.created_at
       FROM test_attempts a
       JOIN tests t ON t.id = a.test_id
       WHERE a.user_id = $1

       UNION ALL

       SELECT
         'reading' AS result_type,
         a.id,
         a.user_id,
         a.lesson_id AS item_id,
         l.title AS item_title,
         a.score,
         a.created_at
       FROM reading_attempts a
       JOIN reading_lessons l ON l.id = a.lesson_id
       WHERE a.user_id = $1
     ) results
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, Number(limit), offset]
  );

  const countResult = await pool.query(
    `SELECT (
       (SELECT COUNT(*) FROM test_attempts WHERE user_id = $1)
       +
       (SELECT COUNT(*) FROM reading_attempts WHERE user_id = $1)
     )::int AS total`,
    [userId]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function getStudentResultSummary(userId) {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*)
        FROM test_attempts
        WHERE user_id = $1)::int AS test_attempts,

       (SELECT ROUND(AVG(score), 2)
        FROM test_attempts
        WHERE user_id = $1) AS average_test_score,

       (SELECT COUNT(*)
        FROM reading_attempts
        WHERE user_id = $1)::int AS reading_attempts,

       (SELECT ROUND(AVG(score), 2)
        FROM reading_attempts
        WHERE user_id = $1) AS average_reading_score,

       (SELECT COUNT(*)
        FROM writing_submissions
        WHERE user_id = $1)::int AS writing_submissions,

       (SELECT COUNT(*)
        FROM speaking_submissions
        WHERE user_id = $1)::int AS speaking_submissions`,
    [userId]
  );

  return result.rows[0];
}

async function getAllResults({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const result = await pool.query(
    `SELECT *
     FROM (
       SELECT
         'test' AS result_type,
         a.id,
         a.user_id,
         u.name AS student_name,
         t.title AS item_title,
         a.score,
         a.created_at
       FROM test_attempts a
       JOIN users u ON u.id = a.user_id
       JOIN tests t ON t.id = a.test_id

       UNION ALL

       SELECT
         'reading' AS result_type,
         a.id,
         a.user_id,
         u.name AS student_name,
         l.title AS item_title,
         a.score,
         a.created_at
       FROM reading_attempts a
       JOIN users u ON u.id = a.user_id
       JOIN reading_lessons l ON l.id = a.lesson_id
     ) results
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [Number(limit), offset]
  );

  const countResult = await pool.query(
    `SELECT (
       (SELECT COUNT(*) FROM test_attempts)
       +
       (SELECT COUNT(*) FROM reading_attempts)
     )::int AS total`
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function getStudentResults(userId, { page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const result = await pool.query(
    `SELECT *
     FROM (
       SELECT
         'test' AS result_type,
         a.id,
         a.test_id AS item_id,
         t.title AS item_title,
         a.score,
         a.created_at
       FROM test_attempts a
       JOIN tests t ON t.id = a.test_id
       WHERE a.user_id = $1

       UNION ALL

       SELECT
         'reading' AS result_type,
         a.id,
         a.lesson_id AS item_id,
         l.title AS item_title,
         a.score,
         a.created_at
       FROM reading_attempts a
       JOIN reading_lessons l ON l.id = a.lesson_id
       WHERE a.user_id = $1
     ) results
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, Number(limit), offset]
  );

  const countResult = await pool.query(
    `SELECT (
       (SELECT COUNT(*) FROM test_attempts WHERE user_id = $1)
       +
       (SELECT COUNT(*) FROM reading_attempts WHERE user_id = $1)
     )::int AS total`,
    [userId]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

module.exports = {
  getMyResults,
  getStudentResultSummary,
  getAllResults,
  getStudentResults
};
