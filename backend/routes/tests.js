
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// =========================================
// GET ACTIVE TESTS
// GET /api/tests
// =========================================

router.get("/", auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, level, created_at
       FROM tests
       WHERE is_active = TRUE
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      tests: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET TEST QUESTIONS
// GET /api/tests/:id
// Correct answers are not returned
// =========================================

router.get("/:id", auth, async (req, res, next) => {
  try {
    const testId = Number(req.params.id);

    if (!Number.isInteger(testId) || testId < 1) {
      return res.status(400).json({
        success: false,
        message: "Test ID noto‘g‘ri."
      });
    }

    const testResult = await pool.query(
      `SELECT id, title, description, level
       FROM tests
       WHERE id = $1 AND is_active = TRUE`,
      [testId]
    );

    if (!testResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Test topilmadi."
      });
    }

    const questionsResult = await pool.query(
      `SELECT id, question, options, question_order
       FROM test_questions
       WHERE test_id = $1
       ORDER BY question_order ASC`,
      [testId]
    );

    res.json({
      success: true,
      test: testResult.rows[0],
      questions: questionsResult.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE TEST
// POST /api/tests
// Admin only
// =========================================

router.post("/", auth, admin, async (req, res, next) => {
  try {
    const { title, description, level } = req.body;

    if (!title || !level) {
      return res.status(400).json({
        success: false,
        message: "Test nomi va darajasi kerak."
      });
    }

    const result = await pool.query(
      `INSERT INTO tests (title, description, level)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description || null, level]
    );

    res.status(201).json({
      success: true,
      test: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// ADD QUESTION
// POST /api/tests/:id/questions
// Admin only
// =========================================

router.post(
  "/:id/questions",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const testId = Number(req.params.id);
      const { question, options, correctAnswer, questionOrder } = req.body;

      if (
        !Number.isInteger(testId) ||
        testId < 1 ||
        !question ||
        !Array.isArray(options) ||
        options.length < 2 ||
        correctAnswer === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol, variantlar va to‘g‘ri javobni kiriting."
        });
      }

      const test = await pool.query(
        "SELECT id FROM tests WHERE id = $1",
        [testId]
      );

      if (!test.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Test topilmadi."
        });
      }

      const result = await pool.query(
        `INSERT INTO test_questions
         (test_id, question, options, correct_answer, question_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, test_id, question, options, question_order`,
        [
          testId,
          question,
          JSON.stringify(options),
          String(correctAnswer),
          Number(questionOrder) || 1
        ]
      );

      res.status(201).json({
        success: true,
        question: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// SUBMIT TEST
// POST /api/tests/:id/submit
// =========================================

router.post("/:id/submit", auth, async (req, res, next) => {
  const client = await pool.connect();

  try {
    const testId = Number(req.params.id);
    const { answers } = req.body;

    if (
      !Number.isInteger(testId) ||
      testId < 1 ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Test yoki javoblar noto‘g‘ri."
      });
    }

    await client.query("BEGIN");

    const testResult = await client.query(
      `SELECT id FROM tests
       WHERE id = $1 AND is_active = TRUE`,
      [testId]
    );

    if (!testResult.rows.length) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Test topilmadi yoki faol emas."
      });
    }

    const questionsResult = await client.query(
      `SELECT id, correct_answer
       FROM test_questions
       WHERE test_id = $1`,
      [testId]
    );

    const questions = questionsResult.rows;

    if (!questions.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Testda savollar mavjud emas."
      });
    }

    const submittedAnswers = new Map();

    for (const answer of answers) {
      const questionId = Number(answer.questionId);

      if (
        !Number.isInteger(questionId) ||
        submittedAnswers.has(questionId)
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Javoblar noto‘g‘ri yoki takrorlangan."
        });
      }

      submittedAnswers.set(
        questionId,
        String(answer.answer)
      );
    }

    const questionIds = new Set(
      questions.map((question) => Number(question.id))
    );

    for (const questionId of submittedAnswers.keys()) {
      if (!questionIds.has(questionId)) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Testga tegishli bo‘lmagan savol yuborildi."
        });
      }
    }

    let correctCount = 0;

    for (const question of questions) {
      const submitted = submittedAnswers.get(
        Number(question.id)
      );

      if (
        submitted !== undefined &&
        submitted === String(question.correct_answer)
      ) {
        correctCount++;
      }
    }

    const totalQuestions = questions.length;
    const score = Number(
      ((correctCount / totalQuestions) * 100).toFixed(2)
    );

    const attemptResult = await client.query(
      `INSERT INTO test_attempts
       (user_id, test_id, total_questions, correct_answers, score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, total_questions, correct_answers, score, created_at`,
      [
        req.user.id,
        testId,
        totalQuestions,
        correctCount,
        score
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Test natijasi saqlandi.",
      result: attemptResult.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

// =========================================
// ACTIVATE / DEACTIVATE TEST
// PATCH /api/tests/:id/status
// Admin only
// =========================================

router.patch(
  "/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const testId = Number(req.params.id);
      const { isActive } = req.body;

      if (
        !Number.isInteger(testId) ||
        testId < 1 ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "Test ID yoki holati noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE tests
         SET is_active = $1
         WHERE id = $2
         RETURNING id, title, is_active`,
        [isActive, testId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Test topilmadi."
        });
      }

      res.json({
        success: true,
        test: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
