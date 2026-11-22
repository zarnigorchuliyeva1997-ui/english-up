
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getTests(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, title, description, level, is_active, created_at
     FROM tests
     WHERE ($1::text IS NULL OR level = $1)
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [query.level || null, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tests
     WHERE ($1::text IS NULL OR level = $1)`,
    [query.level || null]
  );

  return {
    tests: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getTestById(testId) {
  const result = await pool.query(
    `SELECT id, title, description, level, is_active
     FROM tests
     WHERE id = $1
     LIMIT 1`,
    [testId]
  );

  return result.rows[0] || null;
}

async function getTestQuestions(testId) {
  const result = await pool.query(
    `SELECT id, test_id, question, options, question_order
     FROM test_questions
     WHERE test_id = $1
     ORDER BY question_order ASC`,
    [testId]
  );

  return result.rows;
}

async function createTest(data) {
  const { title, description, level } = data;

  const result = await pool.query(
    `INSERT INTO tests (title, description, level, is_active)
     VALUES ($1, $2, $3, FALSE)
     RETURNING *`,
    [title, description || null, level]
  );

  return result.rows[0];
}

async function addQuestion(testId, data) {
  const { question, options, correctAnswer, questionOrder } = data;

  const result = await pool.query(
    `INSERT INTO test_questions (
       test_id, question, options, correct_answer, question_order
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, test_id, question, options, question_order`,
    [
      testId,
      question,
      JSON.stringify(options),
      correctAnswer,
      questionOrder || 1
    ]
  );

  return result.rows[0];
}

async function submitTest(userId, testId, answers) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const testResult = await client.query(
      `SELECT id FROM tests
       WHERE id = $1 AND is_active = TRUE
       FOR SHARE`,
      [testId]
    );

    if (!testResult.rows.length) {
      const error = new Error("Test topilmadi yoki faol emas.");
      error.statusCode = 404;
      throw error;
    }

    const questionsResult = await client.query(
      `SELECT id, correct_answer
       FROM test_questions
       WHERE test_id = $1`,
      [testId]
    );

    const questions = questionsResult.rows;

    if (!questions.length) {
      const error = new Error("Testda savollar mavjud emas.");
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

    const attemptResult = await client.query(
      `INSERT INTO test_attempts (
         user_id, test_id, total_questions, correct_answers, score
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, test_id, total_questions,
                 correct_answers, score, created_at`,
      [userId, testId, questions.length, correct, score]
    );

    await client.query("COMMIT");

    return attemptResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function setTestStatus(testId, isActive) {
  const result = await pool.query(
    `UPDATE tests
     SET is_active = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, is_active`,
    [testId, isActive]
  );

  return result.rows[0] || null;
}

module.exports = {
  getTests,
  getTestById,
  getTestQuestions,
  createTest,
  addQuestion,
  submitTest,
  setTestStatus
};
