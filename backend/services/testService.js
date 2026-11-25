
const { pool } = require("../config/database");

async function getTests({ courseId, isPublished } = {}) {
  const conditions = [];
  const values = [];

  if (courseId) {
    values.push(courseId);
    conditions.push(`course_id = $${values.length}`);
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
     FROM tests
     ${where}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

async function getTestById(testId, includeAnswers = false) {
  const testResult = await pool.query(
    `SELECT *
     FROM tests
     WHERE id = $1`,
    [testId]
  );

  if (testResult.rows.length === 0) {
    throw new Error("Test not found");
  }

  const questionsResult = await pool.query(
    `SELECT
       id,
       test_id,
       question,
       options,
       ${
         includeAnswers
           ? "correct_answer"
           : "NULL AS correct_answer"
       },
       explanation,
       question_order AS sort_order
     FROM test_questions
     WHERE test_id = $1
     ORDER BY question_order ASC, id ASC`,
    [testId]
  );

  return {
    ...testResult.rows[0],
    questions: questionsResult.rows
  };
}

async function createTest({
  title,
  description = "",
  courseId = null,
  isPublished = false
}) {
  if (!title) {
    throw new Error("Test title is required");
  }

  const result = await pool.query(
    `INSERT INTO tests
      (title, description, course_id, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      title.trim(),
      description,
      courseId,
      isPublished
    ]
  );

  return result.rows[0];
}

async function addQuestion({
  testId,
  question,
  options,
  correctAnswer,
  explanation = "",
  sortOrder = 0
}) {
  if (
    !testId ||
    !question ||
    !options ||
    correctAnswer === undefined
  ) {
    throw new Error("Required question fields are missing");
  }

  const result = await pool.query(
    `INSERT INTO test_questions
      (
        test_id,
        question,
        options,
        correct_answer,
        explanation,
        question_order
      )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      testId,
      question,
      JSON.stringify(options),
      correctAnswer,
      explanation,
      sortOrder
    ]
  );

  return {
    ...result.rows[0],
    sort_order: result.rows[0].question_order
  };
}

async function submitTest({ userId, testId, answers }) {
  if (!userId || !testId || !Array.isArray(answers)) {
    throw new Error("Invalid test submission");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const testResult = await client.query(
      `SELECT id
       FROM tests
       WHERE id = $1 AND is_active = TRUE`,
      [testId]
    );

    if (testResult.rows.length === 0) {
      throw new Error("Test not found or not active");
    }

    const questionsResult = await client.query(
      `SELECT id, correct_answer
       FROM test_questions
       WHERE test_id = $1`,
      [testId]
    );

    const questions = questionsResult.rows;

    if (questions.length === 0) {
      throw new Error("Test has no questions");
    }

    const answerMap = new Map(
      answers.map((item) => [
        String(item.questionId),
        item.answer
      ])
    );

    let correctCount = 0;

    for (const question of questions) {
      const submittedAnswer = answerMap.get(String(question.id));

      if (
        submittedAnswer !== undefined &&
        String(submittedAnswer) === String(question.correct_answer)
      ) {
        correctCount++;
      }
    }

    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    const result = await client.query(
      `INSERT INTO test_attempts
        (
          user_id,
          test_id,
          answers,
          score,
          total_questions,
          correct_answers
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        testId,
        JSON.stringify(answers),
        score,
        questions.length,
        correctCount
      ]
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

async function getUserTestAttempts(userId, testId = null) {
  const values = [userId];
  let condition = "user_id = $1";

  if (testId) {
    values.push(testId);
    condition += " AND test_id = $2";
  }

  const result = await pool.query(
    `SELECT *
     FROM test_attempts
     WHERE ${condition}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
}

async function deleteTest(testId) {
  const result = await pool.query(
    `DELETE FROM tests
     WHERE id = $1
     RETURNING id`,
    [testId]
  );

  if (result.rows.length === 0) {
    throw new Error("Test not found");
  }

  return { success: true };
}

module.exports = {
  getTests,
  getTestById,
  createTest,
  addQuestion,
  submitTest,
  getUserTestAttempts,
  deleteTest
};
