
const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// =========================================
// HELPERS
// =========================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const isOptionalText = (value) =>
  value === undefined ||
  value === null ||
  typeof value === "string";

const isOptionalId = (value) => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0;
};

// =========================================
// GET ACTIVE READING MATERIALS
// GET /api/reading
// =========================================

router.get("/", auth, async (req, res, next) => {
  try {
    const { level } = req.query;

    if (
      level !== undefined &&
      (typeof level !== "string" || !level.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Reading darajasi noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         level,
         instructions,
         created_at
       FROM reading_lessons
       WHERE is_active = TRUE
         AND ($1::varchar IS NULL OR level = $1)
       ORDER BY level NULLS LAST, created_at, id`,
      [level ? level.trim() : null]
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
      `SELECT
         id,
         course_id,
         lesson_id,
         title,
         description,
         level,
         passage,
         instructions,
         created_at
       FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questions = await pool.query(
      `SELECT
         id,
         question,
         options,
         question_order
       FROM reading_questions
       WHERE reading_lesson_id = $1
       ORDER BY question_order, id`,
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
    if (!isObject(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Yuborilgan ma’lumot noto‘g‘ri."
      });
    }

    const {
      courseId,
      lessonId,
      title,
      description,
      level,
      passage,
      instructions
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof passage !== "string" ||
      !passage.trim() ||
      !isOptionalId(courseId) ||
      !isOptionalId(lessonId) ||
      !isOptionalText(description) ||
      !isOptionalText(level) ||
      !isOptionalText(instructions)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha va reading matni kerak. Boshqa maydonlarni ham tekshiring."
      });
    }

    const result = await pool.query(
      `INSERT INTO reading_lessons
       (
         course_id,
         lesson_id,
         title,
         description,
         level,
         passage,
         instructions
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        courseId ? Number(courseId) : null,
        lessonId ? Number(lessonId) : null,
        title.trim(),
        description ? description.trim() : null,
        level ? level.trim() : null,
        passage.trim(),
        instructions ? instructions.trim() : null
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

      if (!Number.isInteger(readingId) || readingId < 1) {
        return res.status(400).json({
          success: false,
          message: "Reading ID noto‘g‘ri."
        });
      }

      if (!isObject(req.body)) {
        return res.status(400).json({
          success: false,
          message: "Yuborilgan ma’lumot noto‘g‘ri."
        });
      }

      const {
        question,
        options,
        correctAnswer,
        explanation,
        questionOrder,
        points
      } = req.body;

      if (
        typeof question !== "string" ||
        !question.trim() ||
        !Array.isArray(options) ||
        options.length < 2 ||
        options.some((option) =>
          option === null ||
          option === undefined ||
          (typeof option === "string" && !option.trim())
        ) ||
        correctAnswer === undefined ||
        correctAnswer === null ||
        !String(correctAnswer).trim() ||
        !isOptionalText(explanation)
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol, kamida ikkita javob varianti va to‘g‘ri javob kerak."
        });
      }

      const reading = await pool.query(
        "SELECT id FROM reading_lessons WHERE id = $1",
        [readingId]
      );

      if (reading.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Reading matni topilmadi."
        });
      }

      let order = 1;

      if (
        questionOrder !== undefined &&
        questionOrder !== null &&
        questionOrder !== ""
      ) {
        order = Number(questionOrder);
      }

      const questionPoints =
        points === undefined || points === null
          ? 1
          : Number(points);

      if (
        !Number.isInteger(order) ||
        order < 1 ||
        !Number.isFinite(questionPoints) ||
        questionPoints <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol tartibi yoki ball noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `INSERT INTO reading_questions
         (
           reading_lesson_id,
           question,
           options,
           correct_answer,
           explanation,
           question_order,
           points
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING
           id,
           reading_lesson_id,
           question,
           options,
           explanation,
           question_order,
           points`,
        [
          readingId,
          question.trim(),
          JSON.stringify(options),
          String(correctAnswer).trim(),
          explanation ? explanation.trim() : null,
          order,
          questionPoints
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
  let client;
  let transactionStarted = false;

  try {
    const readingId = Number(req.params.id);

    if (
      !Number.isInteger(readingId) ||
      readingId < 1 ||
      !isObject(req.body) ||
      !Array.isArray(req.body.answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Reading ID yoki javoblar noto‘g‘ri."
      });
    }

    const { answers } = req.body;

    client = await pool.connect();

    await client.query("BEGIN");
    transactionStarted = true;

    const reading = await client.query(
      `SELECT id
       FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [readingId]
    );

    if (reading.rows.length === 0) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questionsResult = await client.query(
      `SELECT id, correct_answer
       FROM reading_questions
       WHERE reading_lesson_id = $1
       ORDER BY question_order, id`,
      [readingId]
    );

    const questions = questionsResult.rows;

    if (questions.length === 0) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        message: "Bu matnda savollar mavjud emas."
      });
    }

    const submitted = new Map();

    for (const item of answers) {
      if (!isObject(item)) {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(400).json({
          success: false,
          message: "Javoblar formati noto‘g‘ri."
        });
      }

      const questionId = Number(item.questionId);

      if (
        !Number.isInteger(questionId) ||
        questionId < 1 ||
        submitted.has(questionId) ||
        item.answer === undefined ||
        item.answer === null
      ) {
        await client.query("ROLLBACK");
        transactionStarted = false;

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
        transactionStarted = false;

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
       (
         user_id,
         reading_lesson_id,
         answers,
         score,
         correct_answers,
         total_questions,
         completed_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING
         id,
         reading_lesson_id,
         total_questions,
         correct_answers,
         score,
         completed_at,
         created_at`,
      [
        req.user.id,
        readingId,
        JSON.stringify(Object.fromEntries(submitted)),
        score,
        correctCount,
        totalQuestions
      ]
    );

    await client.query("COMMIT");
    transactionStarted = false;

    res.json({
      success: true,
      message: "Reading natijasi saqlandi.",
      result: saved.rows[0]
    });
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        // Asosiy xatolik saqlanadi.
      }
    }

    next(error);
  } finally {
    if (client) {
      client.release();
    }
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

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        !isObject(req.body) ||
        typeof req.body.isActive !== "boolean"
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
        [req.body.isActive, id]
      );

      if (result.rows.length === 0) {
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
