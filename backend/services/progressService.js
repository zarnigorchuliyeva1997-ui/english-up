
const { pool } = require("../config/database");

async function getStudentProgress(userId) {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS total_lessons,
       COUNT(*) FILTER (WHERE completed = TRUE) AS completed_lessons,
       COALESCE(AVG(score), 0) AS average_score
     FROM learning_progress
     WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];

  return {
    totalLessons: Number(row.total_lessons),
    completedLessons: Number(row.completed_lessons),
    averageScore: Number(Number(row.average_score).toFixed(2))
  };
}

async function getLessonProgress(userId, lessonId) {
  const result = await pool.query(
    `SELECT id, user_id, lesson_id, score,
            completed, completed_at
     FROM learning_progress
     WHERE user_id = $1 AND lesson_id = $2
     LIMIT 1`,
    [userId, lessonId]
  );

  return result.rows[0] || null;
}

async function saveLessonProgress(userId, data) {
  const { lessonId, score, completed } = data;

  const result = await pool.query(
    `INSERT INTO learning_progress (
       user_id, lesson_id, score, completed, completed_at
     )
     VALUES (
       $1, $2, $3, $4,
       CASE WHEN $4 = TRUE THEN NOW() ELSE NULL END
     )
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET
       score = EXCLUDED.score,
       completed = EXCLUDED.completed,
       completed_at = CASE
         WHEN EXCLUDED.completed = TRUE
         THEN COALESCE(learning_progress.completed_at, NOW())
         ELSE NULL
       END
     RETURNING *`,
    [userId, lessonId, score ?? null, Boolean(completed)]
  );

  return result.rows[0];
}

async function getCourseProgress(userId, courseId) {
  const result = await pool.query(
    `SELECT
       COUNT(l.id) AS total_lessons,
       COUNT(lp.id) FILTER (
         WHERE lp.completed = TRUE
       ) AS completed_lessons
     FROM lessons l
     LEFT JOIN learning_progress lp
       ON lp.lesson_id = l.id AND lp.user_id = $1
     WHERE l.course_id = $2 AND l.is_active = TRUE`,
    [userId, courseId]
  );

  const row = result.rows[0];
  const total = Number(row.total_lessons);
  const completedCount = Number(row.completed_lessons);

  return {
    totalLessons: total,
    completedLessons: completedCount,
    percentage: total > 0
      ? Math.round((completedCount / total) * 100)
      : 0
  };
}

module.exports = {
  getStudentProgress,
  getLessonProgress,
  saveLessonProgress,
  getCourseProgress
};
