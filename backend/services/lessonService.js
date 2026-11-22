
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getLessonsByCourse(courseId, query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, course_id, title, description, content,
            audio_url, video_url, pdf_url, lesson_order, is_active
     FROM lessons
     WHERE course_id = $1
     ORDER BY lesson_order ASC
     LIMIT $2 OFFSET $3`,
    [courseId, limit, offset]
  );

  const countResult = await pool.query(
    "SELECT COUNT(*) FROM lessons WHERE course_id = $1",
    [courseId]
  );

  return {
    lessons: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getActiveLessons(courseId) {
  const result = await pool.query(
    `SELECT id, course_id, title, description, content,
            audio_url, video_url, pdf_url, lesson_order
     FROM lessons
     WHERE course_id = $1 AND is_active = TRUE
     ORDER BY lesson_order ASC`,
    [courseId]
  );

  return result.rows;
}

async function getLessonById(lessonId) {
  const result = await pool.query(
    `SELECT id, course_id, title, description, content,
            audio_url, video_url, pdf_url, lesson_order, is_active
     FROM lessons
     WHERE id = $1
     LIMIT 1`,
    [lessonId]
  );

  return result.rows[0] || null;
}

async function createLesson(data) {
  const {
    courseId,
    title,
    description,
    content,
    audioUrl,
    videoUrl,
    pdfUrl,
    lessonOrder
  } = data;

  const result = await pool.query(
    `INSERT INTO lessons (
       course_id, title, description, content,
       audio_url, video_url, pdf_url, lesson_order, is_active
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
     RETURNING *`,
    [
      courseId,
      title,
      description || null,
      content || null,
      audioUrl || null,
      videoUrl || null,
      pdfUrl || null,
      lessonOrder || 1
    ]
  );

  return result.rows[0];
}

async function updateLesson(lessonId, data) {
  const {
    title,
    description,
    content,
    audioUrl,
    videoUrl,
    pdfUrl,
    lessonOrder
  } = data;

  const result = await pool.query(
    `UPDATE lessons
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         content = COALESCE($4, content),
         audio_url = COALESCE($5, audio_url),
         video_url = COALESCE($6, video_url),
         pdf_url = COALESCE($7, pdf_url),
         lesson_order = COALESCE($8, lesson_order),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      lessonId,
      title ?? null,
      description ?? null,
      content ?? null,
      audioUrl ?? null,
      videoUrl ?? null,
      pdfUrl ?? null,
      lessonOrder ?? null
    ]
  );

  return result.rows[0] || null;
}

async function setLessonStatus(lessonId, isActive) {
  const result = await pool.query(
    `UPDATE lessons
     SET is_active = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, course_id, title, is_active`,
    [lessonId, isActive]
  );

  return result.rows[0] || null;
}

async function deleteLesson(lessonId) {
  const result = await pool.query(
    `DELETE FROM lessons
     WHERE id = $1
     RETURNING id`,
    [lessonId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getLessonsByCourse,
  getActiveLessons,
  getLessonById,
  createLesson,
  updateLesson,
  setLessonStatus,
  deleteLesson
};
