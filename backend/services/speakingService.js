
const { pool } = require("../config/database");
const { getFileUrl } = require("./fileService");

async function getSpeakingTasks({ level, isPublished } = {}) {
  const conditions = [];
  const values = [];

  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }

  if (typeof isPublished === "boolean") {
    values.push(isPublished);
    conditions.push(`is_active = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT *
     FROM speaking_tasks
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

async function getSpeakingTaskById(taskId) {
  const taskResult = await pool.query(
    `SELECT *
     FROM speaking_tasks
     WHERE id = $1`,
    [taskId]
  );

  if (taskResult.rows.length === 0) {
    throw new Error("Speaking task not found");
  }

  const questionsResult = await pool.query(
    `SELECT
       id,
       speaking_task_id AS task_id,
       question,
       question_order AS sort_order
     FROM speaking_questions
     WHERE speaking_task_id = $1
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
  description = "",
  level,
  instructions = "",
  isPublished = false
}) {
  if (!title || !level) {
    throw new Error("Title and level are required");
  }

  const result = await pool.query(
    `INSERT INTO speaking_tasks
      (title, description, level, instructions, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      title.trim(),
      description,
      level,
      instructions,
      isPublished
    ]
  );

  return result.rows[0];
}

async function addSpeakingQuestion({
  taskId,
  question,
  sortOrder = 0
}) {
  if (!taskId || !question) {
    throw new Error("Task ID and question are required");
  }

  const result = await pool.query(
    `INSERT INTO speaking_questions
      (speaking_task_id, question, question_order)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [taskId, question, sortOrder]
  );

  return {
    ...result.rows[0],
    task_id: result.rows[0].speaking_task_id,
    sort_order: result.rows[0].question_order
  };
}

async function submitSpeaking({
  userId,
  taskId,
  questionId = null,
  audioKey,
  duration = null
}) {
  if (!userId || !taskId || !audioKey) {
    throw new Error("User, task and audio file are required");
  }

  if (!audioKey.startsWith("english-up/")) {
    throw new Error("Invalid audio file key");
  }

  const task = await pool.query(
    `SELECT id
     FROM speaking_tasks
     WHERE id = $1 AND is_active = TRUE`,
    [taskId]
  );

  if (task.rows.length === 0) {
    throw new Error("Speaking task not found or not active");
  }

  if (questionId) {
    const question = await pool.query(
      `SELECT id
       FROM speaking_questions
       WHERE id = $1 AND speaking_task_id = $2`,
      [questionId, taskId]
    );

    if (question.rows.length === 0) {
      throw new Error("Speaking question not found");
    }
  }

  const result = await pool.query(
    `INSERT INTO speaking_submissions
      (user_id, task_id, audio_key, duration_seconds, status)
     VALUES ($1, $2, $3, $4, 'submitted')
     RETURNING *`,
    [
      userId,
      taskId,
      audioKey,
      duration
    ]
  );

  return {
    ...result.rows[0],
    duration: result.rows[0].duration_seconds
  };
}

async function getUserSpeakingSubmissions(userId) {
  const result = await pool.query(
    `SELECT ss.*, st.title AS task_title
     FROM speaking_submissions ss
     JOIN speaking_tasks st ON st.id = ss.task_id
     WHERE ss.user_id = $1
     ORDER BY ss.created_at DESC`,
    [userId]
  );

  return Promise.all(
    result.rows.map(async (submission) => ({
      ...submission,
      duration: submission.duration_seconds,
      audio_url: submission.audio_key
        ? await getFileUrl(submission.audio_key)
        : null
    }))
  );
}

async function getAllSpeakingSubmissions({
  status,
  page = 1,
  limit = 50
} = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(
    100,
    Math.max(1, Number.parseInt(limit, 10) || 50)
  );

  const values = [];
  let where = "";

  if (status) {
    values.push(status);
    where = `WHERE ss.status = $1`;
  }

  values.push(safeLimit, (safePage - 1) * safeLimit);

  const result = await pool.query(
    `SELECT
       ss.*,
       u.name AS user_name,
       u.email,
       st.title AS task_title
     FROM speaking_submissions ss
     JOIN users u ON u.id = ss.user_id
     JOIN speaking_tasks st ON st.id = ss.task_id
     ${where}
     ORDER BY ss.created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return Promise.all(
    result.rows.map(async (submission) => ({
      ...submission,
      duration: submission.duration_seconds,
      audio_url: submission.audio_key
        ? await getFileUrl(submission.audio_key)
        : null
    }))
  );
}

async function reviewSpeakingSubmission({
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
    (
      !Number.isFinite(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > 100
    )
  ) {
    throw new Error("Score must be between 0 and 100");
  }

  const result = await pool.query(
    `UPDATE speaking_submissions
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
    throw new Error("Speaking submission not found");
  }

  return {
    ...result.rows[0],
    duration: result.rows[0].duration_seconds
  };
}

async function updateSpeakingTask(taskId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
    instructions: "instructions",
    isPublished: "is_active"
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
    throw new Error("No speaking task fields provided");
  }

  values.push(taskId);

  const result = await pool.query(
    `UPDATE speaking_tasks
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Speaking task not found");
  }

  return result.rows[0];
}

async function deleteSpeakingTask(taskId) {
  const result = await pool.query(
    `DELETE FROM speaking_tasks
     WHERE id = $1
     RETURNING id`,
    [taskId]
  );

  if (result.rows.length === 0) {
    throw new Error("Speaking task not found");
  }

  return { success: true };
}

module.exports = {
  getSpeakingTasks,
  getSpeakingTaskById,
  createSpeakingTask,
  addSpeakingQuestion,
  submitSpeaking,
  getUserSpeakingSubmissions,
  getAllSpeakingSubmissions,
  reviewSpeakingSubmission,
  updateSpeakingTask,
  deleteSpeakingTask
};
