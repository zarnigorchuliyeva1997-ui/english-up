
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// =========================================
// GET ACTIVE READING MATERIALS
// GET /api/reading
// =========================================

router.get("/", auth, async (req, res, next) => {
  try {
    const { level } = req.query;

    const result = await pool.query(
      `SELECT id, title, description, level, reading_order
       FROM reading_lessons
       WHERE is_active = TRUE
       AND ($1::varchar IS NULL OR level = $1)
       ORDER BY level, reading_order`,
      [level || null]
    );

    res.json({
      success: true,
      lessons: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// GET ONE READING MATERIAL
// GET /api/reading/:id
// =========================================

router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Reading ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `SELECT id, title, description, level, content,
              reading_order
       FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questions = await pool.query(
      `SELECT id, question, options, question_order
       FROM reading_questions
       WHERE reading_id = $1
       ORDER BY question_order`,
      [id]
    );

    res.json({
      success: true,
      lesson: result.rows[0],
      questions: questions.rows
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// CREATE READING MATERIAL
// POST /api/reading
// Admin only
// =========================================

router.post("/", auth, admin, async (req, res, next) => {
  try {
    const {
      title,
      description,
      level,
      content,
      readingOrder
    } = req.body;

    if (!title || !level || !content) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha, daraja va matn kerak."
      });
    }

    const result = await pool.query(
      `INSERT INTO reading_lessons
       (title, description, level, content, reading_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        title,
        description || null,
        level,
        content,
        Math.max(1, Number(readingOrder) || 1)
      ]
    );

    res.status(201).json({
      success: true,
      lesson: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// ADD READING QUESTION
// POST /api/reading/:id/questions
// Admin only
// =========================================

router.post(
  "/:id/questions",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const readingId = Number(req.params.id);
      const {
        question,
        options,
        correctAnswer,
        questionOrder
      } = req.body;

      if (
        !Number.isInteger(readingId) ||
        readingId < 1 ||
        !question ||
        !Array.isArray(options) ||
        options.length < 2 ||
        correctAnswer === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol, javob variantlari va to‘g‘ri javob kerak."
        });
      }

      const reading = await pool.query(
        "SELECT id FROM reading_lessons WHERE id = $1",
        [readingId]
      );

      if (!reading.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Reading matni topilmadi."
        });
      }

      const result = await pool.query(
        `INSERT INTO reading_questions
         (reading_id, question, options, correct_answer, question_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, reading_id, question, options, question_order`,
        [
          readingId,
          question,
          JSON.stringify(options),
          String(correctAnswer),
          Math.max(1, Number(questionOrder) || 1)
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
// SUBMIT READING ANSWERS
// POST /api/reading/:id/submit
// =========================================

router.post("/:id/submit", auth, async (req, res, next) => {
  const client = await pool.connect();

  try {
    const readingId = Number(req.params.id);
    const { answers } = req.body;

    if (
      !Number.isInteger(readingId) ||
      readingId < 1 ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Reading ID yoki javoblar noto‘g‘ri."
      });
    }

    await client.query("BEGIN");

    const reading = await client.query(
      `SELECT id FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [readingId]
    );

    if (!reading.rows.length) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questionsResult = await client.query(
      `SELECT id, correct_answer
       FROM reading_questions
       WHERE reading_id = $1`,
      [readingId]
    );

    const questions = questionsResult.rows;

    if (!questions.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Bu matnda savollar mavjud emas."
      });
    }

    const submitted = new Map();

    for (const item of answers) {
      const questionId = Number(item.questionId);

      if (
        !Number.isInteger(questionId) ||
        submitted.has(questionId)
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Javoblar noto‘g‘ri yoki takrorlangan."
        });
      }

      submitted.set(questionId, String(item.answer));
    }

    const validIds = new Set(
      questions.map((item) => Number(item.id))
    );

    for (const questionId of submitted.keys()) {
      if (!validIds.has(questionId)) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Noto‘g‘ri savol ID yuborildi."
        });
      }
    }

    let correctCount = 0;

    for (const question of questions) {
      if (
        submitted.get(Number(question.id)) ===
        String(question.correct_answer)
      ) {
        correctCount++;
      }
    }

    const totalQuestions = questions.length;
    const score = Number(
      ((correctCount / totalQuestions) * 100).toFixed(2)
    );

    const saved = await client.query(
      `INSERT INTO reading_attempts
       (user_id, reading_id, total_questions, correct_answers, score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, total_questions, correct_answers, score, created_at`,
      [
        req.user.id,
        readingId,
        totalQuestions,
        correctCount,
        score
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Reading natijasi saqlandi.",
      result: saved.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

// =========================================
// UPDATE READING STATUS
// PATCH /api/reading/:id/status
// Admin only
// =========================================

router.patch(
  "/:id/status",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { isActive } = req.body;

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "ID yoki holat noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `UPDATE reading_lessons
         SET is_active = $1
         WHERE id = $2
         RETURNING id, title, is_active`,
        [isActive, id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Reading matni topilmadi."
        });
      }

      res.json({
        success: true,
        lesson: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
