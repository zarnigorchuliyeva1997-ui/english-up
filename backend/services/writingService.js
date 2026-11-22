
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

function countWords(content) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

async function getWritingTasks(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, title, description, level,
            instructions, word_limit
     FROM writing_tasks
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR level = $1)
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [query.level || null, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM writing_tasks
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR level = $1)`,
    [query.level || null]
  );

  return {
    tasks: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getWritingTaskById(taskId) {
  const result = await pool.query(
    `SELECT id, title, description, level,
            instructions, word_limit
     FROM writing_tasks
     WHERE id = $1 AND is_active = TRUE
     LIMIT 1`,
    [taskId]
  );

  return result.rows[0] || null;
}

async function createWritingTask(data) {
  const {
    title,
    description,
    level,
    instructions,
    wordLimit
  } = data;

  const result = await pool.query(
    `INSERT INTO writing_tasks (
       title, description, level,
       instructions, word_limit, is_active
     )
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [
      title,
      description || null,
      level,
      instructions,
      wordLimit || null
    ]
  );

  return result.rows[0];
}

async function submitWriting(userId, taskId, content) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Yozma ish bo'sh bo'lishi mumkin emas.");
  }

  const task = await getWritingTaskById(taskId);

  if (!task) {
    const error = new Error("Writing topshirig'i topilmadi.");
    error.statusCode = 404;
    throw error;
  }

  const wordCount = countWords(content);

  if (task.word_limit && wordCount > task.word_limit) {
    const error = new Error(
      `So'zlar soni ${task.word_limit} tadan oshmasligi kerak.`
    );
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO writing_submissions (
       user_id, task_id, content, word_count, status
     )
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING id, user_id, task_id, content,
               word_count, status, created_at`,
    [userId, taskId, content.trim(), wordCount]
  );

  return result.rows[0];
}

async function getMyWritingSubmissions(userId, query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT ws.id, ws.task_id, wt.title,
            ws.content, ws.word_count, ws.status,
            ws.score, ws.feedback, ws.created_at
     FROM writing_submissions ws
     JOIN writing_tasks wt ON wt.id = ws.task_id
     WHERE ws.user_id = $1
     ORDER BY ws.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const countResult = await pool.query(
    "SELECT COUNT(*) FROM writing_submissions WHERE user_id = $1",
    [userId]
  );

  return {
    submissions: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function reviewWriting(submissionId, data) {
  const { score, feedback } = data;

  if (
    !Number.isFinite(Number(score)) ||
    Number(score) < 0 ||
    Number(score) > 100
  ) {
    throw new Error("Baho 0 dan 100 gacha bo'lishi kerak.");
  }

  const result = await pool.query(
    `UPDATE writing_submissions
     SET score = $2,
         feedback = $3,
         status = 'reviewed',
         reviewed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [submissionId, Number(score), feedback || null]
  );

  return result.rows[0] || null;
}

async function setWritingTaskStatus(taskId, isActive) {
  const result = await pool.query(
    `UPDATE writing_tasks
     SET is_active = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, is_active`,
    [taskId, isActive]
  );

  return result.rows[0] || null;
}

module.exports = {
  countWords,
  getWritingTasks,
  getWritingTaskById,
  createWritingTask,
  submitWriting,
  getMyWritingSubmissions,
  reviewWriting,
  setWritingTaskStatus
};
