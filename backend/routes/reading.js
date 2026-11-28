const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

const isObject = value =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const validId = value =>
  Number.isInteger(Number(value)) && Number(value) > 0;

const optionalText = value =>
  value === undefined || value === null || typeof value === "string";

const validateQuestion = body => {
  if (
    !isObject(body) ||
    typeof body.question !== "string" ||
    !body.question.trim() ||
    !Array.isArray(body.options) ||
    body.options.length < 2 ||
    body.options.some(option =>
      typeof option !== "string" || !option.trim()
    ) ||
    body.correctAnswer === undefined ||
    body.correctAnswer === null ||
    !String(body.correctAnswer).trim() ||
    !optionalText(body.explanation)
  ) {
    return false;
  }

  const points = body.points === undefined ? 1 : Number(body.points);

  return Number.isFinite(points) && points > 0;
};

/* =========================================
   ADMIN: GET ALL READING MATERIALS
   GET /api/reading/admin/all
========================================= */

router.get("/admin/all", auth, admin, async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        r.*,
        COUNT(q.id)::INTEGER AS questions_count
      FROM reading_lessons r
      LEFT JOIN reading_questions q
        ON q.reading_lesson_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC, r.id DESC
    `);

    res.json({
      success: true,
      lessons: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================
   GET ACTIVE READING MATERIALS
   GET /api/reading
========================================= */

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

/* =========================================
   GET ONE READING MATERIAL
   GET /api/reading/:id
========================================= */

router.get("/:id", auth, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Reading ID noto‘g‘ri."
      });
    }

    const id = Number(req.params.id);

    const lessonResult = await pool.query(
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

    if (!lessonResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questionsResult = await pool.query(
      `SELECT id, question, options, question_order
       FROM reading_questions
       WHERE reading_lesson_id = $1
       ORDER BY question_order, id`,
      [id]
    );

    res.json({
      success: true,
      lesson: lessonResult.rows[0],
      questions: questionsResult.rows
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================
   CREATE READING MATERIAL
   POST /api/reading
========================================= */

router.post("/", auth, admin, async (req, res, next) => {
  try {
    const {
      courseId,
      lessonId,
      title,
      description,
      level,
      passage,
      instructions
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof passage !== "string" ||
      !passage.trim() ||
      (courseId !== undefined && courseId !== null && courseId !== "" && !validId(courseId)) ||
      (lessonId !== undefined && lessonId !== null && lessonId !== "" && !validId(lessonId)) ||
      !optionalText(description) ||
      !optionalText(level) ||
      !optionalText(instructions)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sarlavha va reading matnini to‘g‘ri kiriting."
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
        description?.trim() || null,
        level?.trim() || null,
        passage.trim(),
        instructions?.trim() || null
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

/* =========================================
   UPDATE READING MATERIAL
   PUT /api/reading/:id
========================================= */

router.put("/:id", auth, admin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Reading ID noto‘g‘ri."
      });
    }

    const {
      courseId,
      lessonId,
      title,
      description,
      level,
      passage,
      instructions,
      isActive
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof passage !== "string" ||
      !passage.trim() ||
      (courseId !== undefined && courseId !== null && courseId !== "" && !validId(courseId)) ||
      (lessonId !== undefined && lessonId !== null && lessonId !== "" && !validId(lessonId)) ||
      !optionalText(description) ||
      !optionalText(level) ||
      !optionalText(instructions) ||
      (isActive !== undefined && typeof isActive !== "boolean")
    ) {
      return res.status(400).json({
        success: false,
        message: "Reading ma’lumotlarini tekshiring."
      });
    }

    const result = await pool.query(
      `UPDATE reading_lessons
       SET
         course_id = $1,
         lesson_id = $2,
         title = $3,
         description = $4,
         level = $5,
         passage = $6,
         instructions = $7,
         is_active = COALESCE($8, is_active),
         updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        courseId ? Number(courseId) : null,
        lessonId ? Number(lessonId) : null,
        title.trim(),
        description?.trim() || null,
        level?.trim() || null,
        passage.trim(),
        instructions?.trim() || null,
        isActive ?? null,
        Number(req.params.id)
      ]
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
});

/* =========================================
   UPDATE READING STATUS
   PATCH /api/reading/:id/status
========================================= */

router.patch("/:id/status", auth, admin, async (req, res, next) => {
  try {
    if (
      !validId(req.params.id) ||
      typeof req.body?.isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "ID yoki holat noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `UPDATE reading_lessons
       SET is_active = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, is_active`,
      [req.body.isActive, Number(req.params.id)]
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
});

/* =========================================
   DELETE READING MATERIAL
   DELETE /api/reading/:id
========================================= */

router.delete("/:id", auth, admin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Reading ID noto‘g‘ri."
      });
    }

    const result = await pool.query(
      `DELETE FROM reading_lessons
       WHERE id = $1
       RETURNING id, title`,
      [Number(req.params.id)]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    res.json({
      success: true,
      message: "Reading matni o‘chirildi.",
      lesson: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================
   ADD READING QUESTION
   POST /api/reading/:id/questions
========================================= */

router.post("/:id/questions", auth, admin, async (req, res, next) => {
  try {
    const readingId = Number(req.params.id);

    if (!validId(readingId) || !validateQuestion(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Savol va javob variantlarini to‘g‘ri kiriting."
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

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(question_order), 0) + 1 AS next_order
       FROM reading_questions
       WHERE reading_lesson_id = $1`,
      [readingId]
    );

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
       RETURNING *`,
      [
        readingId,
        req.body.question.trim(),
        JSON.stringify(req.body.options),
        String(req.body.correctAnswer).trim(),
        req.body.explanation?.trim() || null,
        orderResult.rows[0].next_order,
        req.body.points === undefined ? 1 : Number(req.body.points)
      ]
    );

    res.status(201).json({
      success: true,
      question: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================
   UPDATE READING QUESTION
   PUT /api/reading/:id/questions/:questionId
========================================= */

router.put(
  "/:id/questions/:questionId",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const readingId = Number(req.params.id);
      const questionId = Number(req.params.questionId);

      if (
        !validId(readingId) ||
        !validId(questionId) ||
        !validateQuestion(req.body)
      ) {
        return res.status(400).json({
          success: false,
          message: "Savol ma’lumotlarini tekshiring."
        });
      }

      const result = await pool.query(
        `UPDATE reading_questions
         SET
           question = $1,
           options = $2,
           correct_answer = $3,
           explanation = $4,
           points = $5
         WHERE id = $6 AND reading_lesson_id = $7
         RETURNING *`,
        [
          req.body.question.trim(),
          JSON.stringify(req.body.options),
          String(req.body.correctAnswer).trim(),
          req.body.explanation?.trim() || null,
          req.body.points === undefined ? 1 : Number(req.body.points),
          questionId,
          readingId
        ]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Savol topilmadi."
        });
      }

      res.json({
        success: true,
        question: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================
   DELETE READING QUESTION
   DELETE /api/reading/:id/questions/:questionId
========================================= */

router.delete(
  "/:id/questions/:questionId",
  auth,
  admin,
  async (req, res, next) => {
    try {
      const readingId = Number(req.params.id);
      const questionId = Number(req.params.questionId);

      if (!validId(readingId) || !validId(questionId)) {
        return res.status(400).json({
          success: false,
          message: "Reading yoki savol ID noto‘g‘ri."
        });
      }

      const result = await pool.query(
        `DELETE FROM reading_questions
         WHERE id = $1 AND reading_lesson_id = $2
         RETURNING id`,
        [questionId, readingId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Savol topilmadi."
        });
      }

      res.json({
        success: true,
        message: "Savol o‘chirildi."
      });
    } catch (error) {
      next(error);
    }
  }
);

/* =========================================
   SUBMIT READING ANSWERS
   POST /api/reading/:id/submit
========================================= */

router.post("/:id/submit", auth, async (req, res, next) => {
  let client;
  let transactionStarted = false;

  try {
    const readingId = Number(req.params.id);
    const answers = req.body?.answers;

    if (!validId(readingId) || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Reading ID yoki javoblar noto‘g‘ri."
      });
    }

    client = await pool.connect();

    await client.query("BEGIN");
    transactionStarted = true;

    const reading = await client.query(
      `SELECT id
       FROM reading_lessons
       WHERE id = $1 AND is_active = TRUE`,
      [readingId]
    );

    if (!reading.rows.length) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      return res.status(404).json({
        success: false,
        message: "Reading matni topilmadi."
      });
    }

    const questionResult = await client.query(
      `SELECT id, correct_answer
       FROM reading_questions
       WHERE reading_lesson_id = $1
       ORDER BY question_order, id`,
      [readingId]
    );

    const questions = questionResult.rows;

    if (!questions.length) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        message: "Bu matnda savollar mavjud emas."
      });
    }

    const submitted = new Map();

    for (const item of answers) {
      if (
        !isObject(item) ||
        !validId(item.questionId) ||
        item.answer === undefined ||
        item.answer === null
      ) {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(400).json({
          success: false,
          message: "Javoblar formati noto‘g‘ri."
        });
      }

      const questionId = Number(item.questionId);

      if (submitted.has(questionId)) {
        await client.query("ROLLBACK");
        transactionStarted = false;

        return res.status(400).json({
          success: false,
          message: "Takrorlangan javob yuborildi."
        });
      }

      submitted.set(questionId, String(item.answer));
    }

    const validQuestionIds = new Set(
      questions.map(question => Number(question.id))
    );

    for (const questionId of submitted.keys()) {
      if (!validQuestionIds.has(questionId)) {
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
        // Original error is preserved.
      }
    }

    next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
