
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getReadingLessons(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, title, description, level, reading_order
     FROM reading_lessons
     WHERE is_active = TRUE
       AND ($1::text IS NULL OR level = $1)
     ORDER BY reading_order ASC
     LIMIT $2 OFFSET $3`,
    [query.level || null, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM reading_lessons
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

async function getReadingLessonById(lessonId) {
  const lessonResult = await pool.query(
    `SELECT id, title, description, level, content, reading_order
     FROM reading_lessons
     WHERE id = $1 AND is_active = TRUE
     LIMIT 1`,
    [lessonId]
  );

  const lesson = lessonResult.rows[0];

  if (!lesson) {
    return null;
  }

  const questionsResult = await pool.query(
    `SELECT id, question, options, question_order
     FROM reading_questions
     WHERE reading_id = $1
     ORDER BY question_order ASC`,
    [lessonId]
  );

  return {
    ...lesson,
    questions: questionsResult.rows
  };
}

async function createReadingLesson(data) {
  const { title, description, level, content, readingOrder } = data;

  const result = await pool.query(
    `INSERT INTO reading_lessons (
       title, description, level, content,
       reading_order, is_active
     )
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [
      title,
      description || null,
      level,
      content,
      readingOrder || 1
    ]
  );

  return result.rows[0];
}

async function addReadingQuestion(lessonId, data) {
  const { question, options, correctAnswer, questionOrder } = data;

  const result = await pool.query(
    `INSERT INTO reading_questions (
       reading_id, question, options,
       correct_answer, question_order
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, reading_id, question, options, question_order`,
    [
      lessonId,
      question,
      JSON.stringify(options),
      correctAnswer,
      questionOrder || 1
    ]
  );

  return result.rows[0];
}

async function submitReading(userId, lessonId, answers) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lessonResult = await client.query(
      `SELECT id FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE
       FOR SHARE`,
      [lessonId]
    );

    if (!lessonResult.rows.length) {
      const error = new Error("Reading darsi topilmadi.");
      error.statusCode = 404;
      throw error;
    }

    const questionResult = await client.query(
      `SELECT id, correct_answer
       FROM reading_questions
       WHERE reading_id = $1`,
      [lessonId]
    );

    const questions = questionResult.rows;

    if (!questions.length) {
      const error = new Error("Reading savollari mavjud emas.");
      error.statusCode = 400;
      throw error;
    }

    const answerMap = new Map(
      (Array.isArray(answers) ? answers : [])
        .map(item => [String(item.questionId), item.answer])
    );

    let correct = 0;

    for (const question of questions) {
      if (
        answerMap.has(String(question.id)) &&
        String(answerMap.get(String(question.id))).trim() ===
          String(question.correct_answer).trim()
      ) {
        correct++;
      }
    }

    const score = Math.round(
      (correct / questions.length) * 100
    );

    const result = await client.query(
      `INSERT INTO reading_attempts (
         user_id, reading_id, total_questions,
         correct_answers, score
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, lessonId, questions.length, correct, score]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function setReadingLessonStatus(lessonId, isActive) {
  const result = await pool.query(
    `UPDATE reading_lessons
     SET is_active = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, level, is_active`,
    [lessonId, isActive]
  );

  return result.rows[0] || null;
}

module.exports = {
  getReadingLessons,
  getReadingLessonById,
  createReadingLesson,
  addReadingQuestion,
  submitReading,
  setReadingLessonStatus
};
