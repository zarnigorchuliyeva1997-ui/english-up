
const { pool } = require("../config/database");

// Progress holatini aniqlash
function formatProgress(row) {
  if (!row) return null;

  return {
    ...row,
    status: row.completed ? "completed" : "in_progress"
  };
}

// Foydalanuvchining barcha progresslari
async function getUserProgress(userId) {
  const result = await pool.query(
    `SELECT *
     FROM learning_progress
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId]
  );

  return result.rows.map(formatProgress);
}

// Bitta dars progressi
async function getLessonProgress(userId, lessonId) {
  const result = await pool.query(
    `SELECT *
     FROM learning_progress
     WHERE user_id = $1 AND lesson_id = $2
     LIMIT 1`,
    [userId, lessonId]
  );

  return formatProgress(result.rows[0] || null);
}

// Dars progressini yangilash
async function updateLessonProgress({
  userId,
  lessonId,
  status,
  score = null
}) {
  if (!userId || !lessonId) {
    throw new Error("User ID and lesson ID are required");
  }

  const allowedStatuses = [
    "not_started",
    "in_progress",
    "completed"
  ];

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

  // Boshlanmagan dars uchun progress yozuvini o'chirish
  if (status === "not_started") {
    await pool.query(
      `DELETE FROM learning_progress
       WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId]
    );

    return {
      user_id: userId,
      lesson_id: lessonId,
      completed: false,
      completed_at: null,
      score: null,
      status: "not_started"
    };
  }

  const completed = status === "completed";

  const result = await pool.query(
    `INSERT INTO learning_progress
      (user_id, lesson_id, completed, completed_at, score)
     VALUES (
       $1,
       $2,
       $3,
       CASE WHEN $3 = TRUE THEN NOW() ELSE NULL END,
       $4
     )
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET
       completed = EXCLUDED.completed,
       completed_at = CASE
         WHEN EXCLUDED.completed = TRUE
           THEN COALESCE(
             learning_progress.completed_at,
             NOW()
           )
         ELSE NULL
       END,
       score = EXCLUDED.score,
       updated_at = NOW()
     RETURNING *`,
    [userId, lessonId, completed, score]
  );

  return formatProgress(result.rows[0]);
}

// Progress statistikasi
async function getProgressSummary(userId) {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total_lessons,
       COUNT(*) FILTER (
         WHERE completed = TRUE
       )::int AS completed_lessons,
       COUNT(*) FILTER (
         WHERE completed = FALSE
       )::int AS in_progress_lessons,
       COALESCE(AVG(score), 0)::numeric(5,2)
         AS average_score
     FROM learning_progress
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

// Dars progressini qayta boshlash
async function resetLessonProgress(userId, lessonId) {
  const result = await pool.query(
    `DELETE FROM learning_progress
     WHERE user_id = $1 AND lesson_id = $2
     RETURNING id`,
    [userId, lessonId]
  );

  return {
    success: true,
    deleted: result.rowCount
  };
}

module.exports = {
  getUserProgress,
  getLessonProgress,
  updateLessonProgress,
  getProgressSummary,
  resetLessonProgress
};
