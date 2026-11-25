
const { pool } = require("../config/database");
const { getFileUrl } = require("./fileService");

async function getListeningLessons({ level, isPublished } = {}) {
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
     FROM listening_lessons
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return Promise.all(
    result.rows.map(async (lesson) => ({
      ...lesson,
      audio_url: lesson.audio_key
        ? await getFileUrl(lesson.audio_key)
        : lesson.audio_url
    }))
  );
}

async function getListeningLessonById(lessonId) {
  const result = await pool.query(
    `SELECT *
     FROM listening_lessons
     WHERE id = $1`,
    [lessonId]
  );

  if (result.rows.length === 0) {
    throw new Error("Listening lesson not found");
  }

  const lesson = result.rows[0];

  return {
    ...lesson,
    audio_url: lesson.audio_key
      ? await getFileUrl(lesson.audio_key)
      : lesson.audio_url
  };
}

async function createListeningLesson({
  title,
  description = "",
  level,
  audioKey = null,
  audioUrl = null,
  transcript = "",
  duration = 0,
  isPublished = false
}) {
  if (!title || !level || (!audioKey && !audioUrl)) {
    throw new Error("Title, level and audio file are required");
  }

  const durationSeconds = Number(duration);

  if (
    !Number.isInteger(durationSeconds) ||
    durationSeconds < 0
  ) {
    throw new Error("Invalid listening duration");
  }

  const result = await pool.query(
    `INSERT INTO listening_lessons
      (title, description, level, audio_key, audio_url,
       transcript, duration_seconds, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      title.trim(),
      description,
      level,
      audioKey,
      audioUrl,
      transcript,
      durationSeconds,
      isPublished
    ]
  );

  return result.rows[0];
}

async function updateListeningLesson(lessonId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
    audioKey: "audio_key",
    audioUrl: "audio_url",
    transcript: "transcript",
    duration: "duration_seconds",
    isPublished: "is_active"
  };

  const fields = [];
  const values = [];

  for (const [key, column] of Object.entries(allowedFields)) {
    if (data[key] !== undefined) {
      let value = data[key];

      if (key === "duration") {
        value = Number(value);

        if (!Number.isInteger(value) || value < 0) {
          throw new Error("Invalid listening duration");
        }
      }

      values.push(value);
      fields.push(`${column} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    throw new Error("No listening lesson fields provided");
  }

  values.push(lessonId);

  const result = await pool.query(
    `UPDATE listening_lessons
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Listening lesson not found");
  }

  return result.rows[0];
}

async function deleteListeningLesson(lessonId) {
  const result = await pool.query(
    `DELETE FROM listening_lessons
     WHERE id = $1
     RETURNING id`,
    [lessonId]
  );

  if (result.rows.length === 0) {
    throw new Error("Listening lesson not found");
  }

  return { success: true };
}

module.exports = {
  getListeningLessons,
  getListeningLessonById,
  createListeningLesson,
  updateListeningLesson,
  deleteListeningLesson
};
