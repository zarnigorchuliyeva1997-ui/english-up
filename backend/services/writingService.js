
const { pool } = require("../config/database");

async function getWritingTasks({ level, isPublished } = {}) {
  const conditions = [];
  const values = [];

  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }

  if (typeof isPublished === "boolean") {
    values.push(isPublished);
    conditions.push(`is_published = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT *
     FROM writing_tasks
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

async function getWritingTaskById(taskId) {
  const result = await pool.query(
    `SELECT *
     FROM writing_tasks
     WHERE id = $1`,
    [taskId]
  );

  if (result.rows.length === 0) {
    throw new Error("Writing task not found");
  }

  return result.rows[0];
}

async function createWritingTask({
  title,
  description = "",
  level,
  instructions,
  wordLimit = null,
  isPublished = false
}) {
  if (!title || !level || !instructions) {
    throw new Error("Title, level and instructions are required");
  }

  const result = await pool.query(
    `INSERT INTO writing_tasks
      (title, description, level, instructions, word_limit, is_published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title.trim(),
      description,
      level,
      instructions,
      wordLimit,
      isPublished
    ]
  );

  return result.rows[0];
}

async function submitWriting({ userId, taskId, content }) {
  if (!userId || !taskId || !content || !content.trim()) {
    throw new Error("User, task and writing content are required");
  }

  const task = await pool.query(
    `SELECT id
     FROM writing_tasks
     WHERE id = $1 AND is_published = TRUE`,
    [taskId]
  );

  if (task.rows.length === 0) {
    throw new Error("Writing task not found or not published");
  }

  const result = await pool.query(
    `INSERT INTO writing_submissions
      (user_id, task_id, content, status)
     VALUES ($1, $2, $3, 'submitted')
     RETURNING *`,
    [userId, taskId, content.trim()]
  );

  return result.rows[0];
}

async function getUserWritingSubmissions(userId) {
  const result = await pool.query(
    `SELECT ws.*, wt.title AS task_title
     FROM writing_submissions ws
     JOIN writing_tasks wt ON wt.id = ws.task_id
     WHERE ws.user_id = $1
     ORDER BY ws.created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function getAllWritingSubmissions({ status, page = 1, limit = 50 } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50));
  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE ws.status = $1`;
  }

  values.push(safeLimit, (safePage - 1) * safeLimit);

  const result = await pool.query(
    `SELECT ws.*, u.name AS user_name, u.email, wt.title AS task_title
     FROM writing_submissions ws
     JOIN users u ON u.id = ws.user_id
     JOIN writing_tasks wt ON wt.id = ws.task_id
     ${where}
     ORDER BY ws.created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return result.rows;
}

async function reviewWritingSubmission({
  submissionId,
  reviewerId,
  feedback,
  score
}) {
  if (!submissionId || !reviewerId || feedback === undefined) {
    throw new Error("Submission, reviewer and feedback are required");
  }

  if (
    score !== undefined &&
    score !== null &&
    (!Number.isFinite(Number(score)) || Number(score) < 0 || Number(score) > 100)
  ) {
    throw new Error("Score must be between 0 and 100");
  }

  const result = await pool.query(
    `UPDATE writing_submissions
     SET feedback = $1,
         score = $2,
         status = 'reviewed',
         reviewed_by = $3,
         reviewed_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [feedback, score ?? null, reviewerId, submissionId]
  );

  if (result.rows.length === 0) {
    throw new Error("Writing submission not found");
  }

  return result.rows[0];
}

async function updateWritingTask(taskId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
    instructions: "instructions",
    wordLimit: "word_limit",
    isPublished: "is_published"
  };

  const fields = [];
  const values = [];

  for (const [key, column] of Object.entries(allowedFields)) {
    if (data[key] !== undefined) {
      values.push(data[key]);
      fields.push(`${column} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    throw new Error("No writing task fields provided");
  }

  values.push(taskId);

  const result = await pool.query(
    `UPDATE writing_tasks
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Writing task not found");
  }

  return result.rows[0];
}

async function deleteWritingTask(taskId) {
  const result = await pool.query(
    `DELETE FROM writing_tasks
     WHERE id = $1
     RETURNING id`,
    [taskId]
  );

  if (result.rows.length === 0) {
    throw new Error("Writing task not found");
  }

  return { success: true };
}

module.exports = {
  getWritingTasks,
  getWritingTaskById,
  createWritingTask,
  submitWriting,
  getUserWritingSubmissions,
  getAllWritingSubmissions,
  reviewWritingSubmission,
  updateWritingTask,
  deleteWritingTask
};
