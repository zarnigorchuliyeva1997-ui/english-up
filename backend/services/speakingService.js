
const { pool } = require("../config/database");

async function getSpeakingTasks({ page = 1, limit = 20, level = null } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const values = [];
  let where = "WHERE is_active = TRUE";

  if (level) {
    values.push(level);
    where += ` AND level = $${values.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM speaking_tasks
     ${where}`,
    values
  );

  values.push(Number(limit), offset);

  const result = await pool.query(
    `SELECT id, title, description, level, instructions,
            created_at
     FROM speaking_tasks
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function getSpeakingTaskById(taskId) {
  const taskResult = await pool.query(
    `SELECT id, title, description, level, instructions,
            is_active, created_at
     FROM speaking_tasks
     WHERE id = $1`,
    [taskId]
  );

  if (!taskResult.rows.length) {
    return null;
  }

  const questionsResult = await pool.query(
    `SELECT id, question, question_order
     FROM speaking_questions
     WHERE task_id = $1
     ORDER BY question_order ASC, id ASC`,
    [taskId]
  );

  return {
    ...taskResult.rows[0],
    questions: questionsResult.rows
  };
}

async function createSpeakingTask({
  title,
  description,
  level,
  instructions
}) {
  const result = await pool.query(
    `INSERT INTO speaking_tasks
      (title, description, level, instructions, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING *`,
    [title, description || null, level, instructions || null]
  );

  return result.rows[0];
}

async function addSpeakingQuestion(
  taskId,
  { question, questionOrder = 1 }
) {
  const task = await pool.query(
    "SELECT id FROM speaking_tasks WHERE id = $1",
    [taskId]
  );

  if (!task.rows.length) {
    throw new Error("Speaking topshirig'i topilmadi");
  }

  const result = await pool.query(
    `INSERT INTO speaking_questions
      (task_id, question, question_order)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, question, questionOrder]
  );

  return result.rows[0];
}

async function submitSpeaking(
  userId,
  taskId,
  audioKey,
  durationSeconds
) {
  if (
    typeof audioKey !== "string" ||
    !audioKey.startsWith("english-up/speaking/")
  ) {
    throw new Error("Audio fayl manzili noto'g'ri");
  }

  const duration = Number(durationSeconds);

  if (
    !Number.isInteger(duration) ||
    duration < 1 ||
    duration > 900
  ) {
    throw new Error("Audio davomiyligi 1–900 soniya bo'lishi kerak");
  }

  const task = await pool.query(
    `SELECT id FROM speaking_tasks
     WHERE id = $1 AND is_active = TRUE`,
    [taskId]
  );

  if (!task.rows.length) {
    throw new Error("Faol speaking topshirig'i topilmadi");
  }

  const result = await pool.query(
    `INSERT INTO speaking_submissions
      (user_id, task_id, audio_key, duration_seconds, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING id, user_id, task_id, duration_seconds,
               status, created_at`,
    [userId, taskId, audioKey, duration]
  );

  return result.rows[0];
}

async function getMySpeakingSubmissions(
  userId,
  { page = 1, limit = 20 } = {}
) {
  const offset = (Number(page) - 1) * Number(limit);

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM speaking_submissions
     WHERE user_id = $1`,
    [userId]
  );

  const result = await pool.query(
    `SELECT s.id, s.task_id, t.title AS task_title,
            s.duration_seconds, s.status, s.score,
            s.feedback, s.created_at, s.reviewed_at
     FROM speaking_submissions s
     JOIN speaking_tasks t ON t.id = s.task_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, Number(limit), offset]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function getSpeakingSubmissions({
  page = 1,
  limit = 20,
  status = null
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE s.status = $${values.length}`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM speaking_submissions s
     ${where}`,
    values
  );

  values.push(Number(limit), offset);

  const result = await pool.query(
    `SELECT s.id, s.user_id, u.name AS student_name,
            s.task_id, t.title AS task_title,
            s.audio_key, s.duration_seconds,
            s.status, s.score, s.feedback,
            s.created_at, s.reviewed_at
     FROM speaking_submissions s
     JOIN users u ON u.id = s.user_id
     JOIN speaking_tasks t ON t.id = s.task_id
     ${where}
     ORDER BY s.created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function reviewSpeaking(
  submissionId,
  { score, feedback }
) {
  const numericScore = Number(score);

  if (
    !Number.isInteger(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    throw new Error("Baholash 0 dan 100 gacha bo'lishi kerak");
  }

  const result = await pool.query(
    `UPDATE speaking_submissions
     SET score = $1,
         feedback = $2,
         status = 'reviewed',
         reviewed_at = NOW()
     WHERE id = $3
     RETURNING id, user_id, task_id, score,
               feedback, status, reviewed_at`,
    [numericScore, feedback || null, submissionId]
  );

  if (!result.rows.length) {
    throw new Error("Speaking javobi topilmadi");
  }

  return result.rows[0];
}

async function setSpeakingTaskStatus(taskId, isActive) {
  const result = await pool.query(
    `UPDATE speaking_tasks
     SET is_active = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [Boolean(isActive), taskId]
  );

  if (!result.rows.length) {
    throw new Error("Speaking topshirig'i topilmadi");
  }

  return result.rows[0];
}

module.exports = {
  getSpeakingTasks,
  getSpeakingTaskById,
  createSpeakingTask,
  addSpeakingQuestion,
  submitSpeaking,
  getMySpeakingSubmissions,
  getSpeakingSubmissions,
  reviewSpeaking,
  setSpeakingTaskStatus
};
