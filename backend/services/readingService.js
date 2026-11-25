
const { pool } = require("../config/database");

async function getReadingLessons({ level, isPublished } = {}) {
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
     FROM reading_lessons
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

async function getReadingLessonById(lessonId) {
  const lessonResult = await pool.query(
    `SELECT *
     FROM reading_lessons
     WHERE id = $1`,
    [lessonId]
  );

  if (lessonResult.rows.length === 0) {
    throw new Error("Reading lesson not found");
  }

  const questionsResult = await pool.query(
    `SELECT
       id,
       reading_lesson_id AS lesson_id,
       question,
       options,
       question_order AS sort_order
     FROM reading_questions
     WHERE reading_lesson_id = $1
     ORDER BY question_order ASC, id ASC`,
    [lessonId]
  );

  return {
    ...lessonResult.rows[0],
    content: lessonResult.rows[0].passage,
    questions: questionsResult.rows
  };
}

async function createReadingLesson({
  title,
  description = "",
  level,
  content,
  isPublished = false
}) {
  if (!title || !level || !content) {
    throw new Error("Title, level and reading content are required");
  }

  const result = await pool.query(
    `INSERT INTO reading_lessons
      (title, description, level, passage, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      title.trim(),
      description,
      level,
      content,
      isPublished
    ]
  );

  return {
    ...result.rows[0],
    content: result.rows[0].passage
  };
}

async function addReadingQuestion({
  lessonId,
  question,
  options,
  correctAnswer,
  explanation = "",
  sortOrder = 0
}) {
  if (
    !lessonId ||
    !question ||
    !options ||
    correctAnswer === undefined
  ) {
    throw new Error("Required question fields are missing");
  }

  const result = await pool.query(
    `INSERT INTO reading_questions
      (
        reading_lesson_id,
        question,
        options,
        correct_answer,
        explanation,
        question_order
      )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      lessonId,
      question,
      JSON.stringify(options),
      correctAnswer,
      explanation,
      sortOrder
    ]
  );

  return {
    ...result.rows[0],
    lesson_id: result.rows[0].reading_lesson_id,
    sort_order: result.rows[0].question_order
  };
}

async function submitReadingAnswers({
  userId,
  lessonId,
  answers
}) {
  if (!userId || !lessonId || !Array.isArray(answers)) {
    throw new Error("Invalid reading submission");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lesson = await client.query(
      `SELECT id
       FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [lessonId]
    );

    if (lesson.rows.length === 0) {
      throw new Error("Reading lesson not found or not active");
    }

    const questionResult = await client.query(
      `SELECT id, correct_answer
       FROM reading_questions
       WHERE reading_lesson_id = $1`,
      [lessonId]
    );

    const questions = questionResult.rows;

    if (questions.length === 0) {
      throw new Error("Reading lesson has no questions");
    }

    const answerMap = new Map(
      answers.map((item) => [
        String(item.questionId),
        item.answer
      ])
    );

    let correctCount = 0;

    for (const question of questions) {
      const answer = answerMap.get(String(question.id));

      if (
        answer !== undefined &&
        String(answer) === String(question.correct_answer)
      ) {
        correctCount++;
      }
    }

    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    const result = await client.query(
      `INSERT INTO reading_attempts
        (
          user_id,
          reading_lesson_id,
          answers,
          score,
          total_questions,
          correct_answers
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        lessonId,
        JSON.stringify(answers),
        score,
        questions.length,
        correctCount
      ]
    );

    await client.query("COMMIT");

    return {
      ...result.rows[0],
      lesson_id: result.rows[0].reading_lesson_id
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getUserReadingAttempts(userId, lessonId = null) {
  const values = [userId];
  let condition = "user_id = $1";

  if (lessonId) {
    values.push(lessonId);
    condition += " AND reading_lesson_id = $2";
  }

  const result = await pool.query(
    `SELECT *
     FROM reading_attempts
     WHERE ${condition}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows.map((row) => ({
    ...row,
    lesson_id: row.reading_lesson_id
  }));
}

async function updateReadingLesson(lessonId, data = {}) {
  const allowedFields = {
    title: "title",
    description: "description",
    level: "level",
    content: "passage",
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
    throw new Error("No reading lesson fields provided");
  }

  values.push(lessonId);

  const result = await pool.query(
    `UPDATE reading_lessons
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Reading lesson not found");
  }

  return {
    ...result.rows[0],
    content: result.rows[0].passage
  };
}

async function deleteReadingLesson(lessonId) {
  const result = await pool.query(
    `DELETE FROM reading_lessons
     WHERE id = $1
     RETURNING id`,
    [lessonId]
  );

  if (result.rows.length === 0) {
    throw new Error("Reading lesson not found");
  }

  return { success: true };
}

module.exports = {
  getReadingLessons,
  getReadingLessonById,
  createReadingLesson,
  addReadingQuestion,
  submitReadingAnswers,
  getUserReadingAttempts,
  updateReadingLesson,
  deleteReadingLesson
};
