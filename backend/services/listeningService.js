
const { pool } = require("../config/database");
const { getFileUrl } = require("./fileService");
const { getPagination } = require("../utils/pagination");

async function getListeningLessons(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, title, description, level,
            audio_key, duration_seconds, lesson_order
     FROM listening_lessons
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR level = $1)
     ORDER BY lesson_order ASC
     LIMIT $2 OFFSET $3`,
    [query.level || null, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)
     FROM listening_lessons
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR level = $1)`,
    [query.level || null]
  );

  return {
    lessons: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getListeningLessonById(lessonId) {
  const result = await pool.query(
    `SELECT id, title, description, level,
            audio_key, duration_seconds, lesson_order
     FROM listening_lessons
     WHERE id = $1 AND is_active = TRUE
     LIMIT 1`,
    [lessonId]
  );

  const lesson = result.rows[0];

  if (!lesson) {
    return null;
  }

  const audioUrl = lesson.audio_key
    ? await getFileUrl(lesson.audio_key)
    : null;

  return {
    ...lesson,
    audioUrl
  };
}

async function createListeningLesson(data) {
  const {
    title,
    description,
    level,
    audioKey,
    durationSeconds,
    lessonOrder
  } = data;

  const result = await pool.query(
    `INSERT INTO listening_lessons (
       title, description, level, audio_key,
       duration_seconds, lesson_order, is_active
     )
     VALUES ($1, $2, $3, $4, $5, $6, FALSE)
     RETURNING *`,
    [
      title,
      description || null,
      level,
      audioKey,
      durationSeconds || null,
      lessonOrder || 1
    ]
  );

  return result.rows[0];
}

async function updateListeningLesson(lessonId, data) {
  const {
    title,
    description,
    level,
    audioKey,
    durationSeconds,
    lessonOrder
  } = data;

  const result = await pool.query(
    `UPDATE listening_lessons
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         level = COALESCE($4, level),
         audio_key = COALESCE($5, audio_key),
         duration_seconds = COALESCE($6, duration_seconds),
         lesson_order = COALESCE($7, lesson_order),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      lessonId,
      title ?? null,
      description ?? null,
      level ?? null,
      audioKey ?? null,
      durationSeconds ?? null,
      lessonOrder ?? null
    ]
  );

  return result.rows[0] || null;
}

async function setListeningLessonStatus(lessonId, isActive) {
  const result = await pool.query(
    `UPDATE listening_lessons
     SET is_active = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, level, is_active`,
    [lessonId, isActive]
  );

  return result.rows[0] || null;
}

async function deleteListeningLesson(lessonId) {
  const result = await pool.query(
    `DELETE FROM listening_lessons
     WHERE id = $1
     RETURNING id, audio_key`,
    [lessonId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getListeningLessons,
  getListeningLessonById,
  createListeningLesson,
  updateListeningLesson,
  setListeningLessonStatus,
  deleteListeningLesson
};
