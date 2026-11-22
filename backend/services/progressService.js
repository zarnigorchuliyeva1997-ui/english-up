
const { pool } = require("../config/database");

async function getUserProgress(userId) {
  const result = await pool.query(
    `SELECT *
     FROM learning_progress
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId]
  );

  return result.rows;
}

async function getLessonProgress(userId, lessonId) {
  const result = await pool.query(
    `SELECT *
     FROM learning_progress
     WHERE user_id = $1 AND lesson_id = $2
     LIMIT 1`,
    [userId, lessonId]
  );

  return result.rows[0] || null;
}

async function updateLessonProgress({
  userId,
  lessonId,
  status,
  score = null
}) {
  if (!userId || !lessonId) {
    throw new Error("User ID and lesson ID are required");
  }

  const allowedStatuses = ["not_started", "in_progress", "completed"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid progress status");
  }

  if (
    score !== null &&
    (!Number.isFinite(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > 100)
  ) {
    throw new Error("Score must be between 0 and 100");
  }

  const result = await pool.query(
    `INSERT INTO learning_progress
      (user_id, lesson_id, status, score)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET
       status = EXCLUDED.status,
       score = EXCLUDED.score,
       updated_at = NOW()
     RETURNING *`,
    [userId, lessonId, status, score]
  );

  return result.rows[0];
}

async function getProgressSummary(userId) {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total_lessons,
       COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_lessons,
       COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress_lessons,
       COALESCE(AVG(score), 0)::numeric(5,2) AS average_score
     FROM learning_progress
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

async function resetLessonProgress(userId, lessonId) {
  const result = await pool.query(
    `DELETE FROM learning_progress
     WHERE user_id = $1 AND lesson_id = $2
     RETURNING id`,
    [userId, lessonId]
  );

  return { success: true, deleted: result.rowCount };
}

module.exports = {
  getUserProgress,
  getLessonProgress,
  updateLessonProgress,
  getProgressSummary,
  resetLessonProgress
};
