
const { pool } = require("../config/database");

// Foydalanuvchining test natijalari
async function getUserTestResults(userId, { limit = 20, offset = 0 } = {}) {
  const result = await pool.query(
    `SELECT
       id,
       test_id,
       score,
       total_questions,
       correct_answers,
       created_at
     FROM test_attempts
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
}

// Foydalanuvchining reading natijalari
async function getUserReadingResults(userId, { limit = 20, offset = 0 } = {}) {
  const result = await pool.query(
    `SELECT
       id,
       reading_lesson_id,
       score,
       total_questions,
       correct_answers,
       created_at
     FROM reading_attempts
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
}

// Foydalanuvchining writing natijalari
async function getUserWritingResults(userId) {
  const result = await pool.query(
    `SELECT
       id,
       task_id,
       status,
       score,
       feedback,
       created_at,
       reviewed_at
     FROM writing_submissions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

// Foydalanuvchining speaking natijalari
async function getUserSpeakingResults(userId) {
  const result = await pool.query(
    `SELECT
       id,
       task_id,
       status,
       score,
       feedback,
       created_at,
       reviewed_at
     FROM speaking_submissions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

// Foydalanuvchining barcha natijalari
async function getUserAllResults(userId) {
  const [
    tests,
    reading,
    writing,
    speaking
  ] = await Promise.all([
    getUserTestResults(userId),
    getUserReadingResults(userId),
    getUserWritingResults(userId),
    getUserSpeakingResults(userId)
  ]);

  return {
    tests,
    reading,
    writing,
    speaking
  };
}

// Admin uchun barcha test natijalari
async function getAllTestResults({ limit = 50, offset = 0 } = {}) {
  const result = await pool.query(
    `SELECT
       a.*,
       u.name AS user_name,
       u.email AS user_email,
       t.title AS test_title
     FROM test_attempts a
     JOIN users u ON u.id = a.user_id
     LEFT JOIN tests t ON t.id = a.test_id
     ORDER BY a.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
}

module.exports = {
  getUserTestResults,
  getUserReadingResults,
  getUserWritingResults,
  getUserSpeakingResults,
  getUserAllResults,
  getAllTestResults
};
