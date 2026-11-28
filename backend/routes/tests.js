const express = require("express");
const { pool } = require("../config/database");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

const isObject = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

function validId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// =========================================
// ADMIN: GET ALL TESTS
// GET /api/tests/admin/all
// =========================================

router.get("/admin/all", auth, admin, async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT
                t.id,
                t.course_id,
                t.lesson_id,
                t.title,
                t.description,
                t.test_type,
                t.time_limit,
                t.passing_score,
                t.is_active,
                t.created_at,
                t.updated_at,
                c.title AS course_title,
                c.level,
                COUNT(q.id)::INTEGER AS question_count
             FROM tests t
             LEFT JOIN courses c ON c.id = t.course_id
             LEFT JOIN test_questions q ON q.test_id = t.id
             GROUP BY t.id, c.title, c.level
             ORDER BY t.created_at DESC, t.id DESC`
        );

        res.json({
            success: true,
            tests: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        next(error);
    }
});

// =========================================
// GET ACTIVE TESTS
// GET /api/tests
// =========================================

router.get("/", auth, async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT
                t.id,
                t.course_id,
                t.lesson_id,
                t.title,
                t.description,
                t.test_type,
                t.time_limit,
                t.passing_score,
                t.created_at,
                c.level
             FROM tests t
             LEFT JOIN courses c ON c.id = t.course_id
             WHERE t.is_active = TRUE
             ORDER BY t.created_at DESC, t.id DESC`
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
// Correct answers are never returned
// =========================================

router.get("/:id", auth, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);

        if (!testId) {
            return res.status(400).json({
                success: false,
                message: "Test ID noto‘g‘ri."
            });
        }

        const testResult = await pool.query(
            `SELECT
                t.id,
                t.course_id,
                t.lesson_id,
                t.title,
                t.description,
                t.test_type,
                t.time_limit,
                t.passing_score,
                c.level
             FROM tests t
             LEFT JOIN courses c ON c.id = t.course_id
             WHERE t.id = $1
               AND t.is_active = TRUE`,
            [testId]
        );

        if (!testResult.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Test topilmadi."
            });
        }

        const questionsResult = await pool.query(
            `SELECT
                id,
                question,
                options,
                question_order,
                points
             FROM test_questions
             WHERE test_id = $1
             ORDER BY question_order ASC, id ASC`,
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
            testType,
            timeLimit,
            passingScore
        } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 200 ||
            (description !== undefined &&
                description !== null &&
                typeof description !== "string") ||
            (testType !== undefined &&
                testType !== null &&
                typeof testType !== "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "Test nomi yoki qo‘shimcha ma’lumot noto‘g‘ri."
            });
        }

        const parsedCourseId =
            courseId === undefined || courseId === null || courseId === ""
                ? null
                : validId(courseId);

        const parsedLessonId =
            lessonId === undefined || lessonId === null || lessonId === ""
                ? null
                : validId(lessonId);

        const parsedTimeLimit =
            timeLimit === undefined || timeLimit === null || timeLimit === ""
                ? null
                : Number(timeLimit);

        const parsedPassingScore =
            passingScore === undefined || passingScore === null
                ? 80
                : Number(passingScore);

        if (
            (courseId !== undefined &&
                courseId !== null &&
                courseId !== "" &&
                !parsedCourseId) ||
            (lessonId !== undefined &&
                lessonId !== null &&
                lessonId !== "" &&
                !parsedLessonId) ||
            (parsedTimeLimit !== null &&
                (!Number.isInteger(parsedTimeLimit) ||
                    parsedTimeLimit < 1 ||
                    parsedTimeLimit > 300)) ||
            !Number.isFinite(parsedPassingScore) ||
            parsedPassingScore < 0 ||
            parsedPassingScore > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Test parametrlari noto‘g‘ri."
            });
        }

        const result = await pool.query(
            `INSERT INTO tests (
                course_id,
                lesson_id,
                title,
                description,
                test_type,
                time_limit,
                passing_score
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                parsedCourseId,
                parsedLessonId,
                title.trim(),
                description ? description.trim() : null,
                testType ? testType.trim() : "general",
                parsedTimeLimit,
                parsedPassingScore
            ]
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
// UPDATE TEST
// PUT /api/tests/:id
// Admin only
// =========================================

router.put("/:id", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);

        if (!testId || !isObject(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Test ID yoki ma’lumot noto‘g‘ri."
            });
        }

        const allowedFields = {
            title: "title",
            description: "description",
            courseId: "course_id",
            lessonId: "lesson_id",
            testType: "test_type",
            timeLimit: "time_limit",
            passingScore: "passing_score"
        };

        const fields = [];
        const values = [];

        for (const [input, column] of Object.entries(allowedFields)) {
            if (req.body[input] === undefined) continue;

            let value = req.body[input];

            if (input === "title") {
                if (
                    typeof value !== "string" ||
                    !value.trim() ||
                    value.trim().length > 200
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Test nomi noto‘g‘ri."
                    });
                }

                value = value.trim();
            }

            if (input === "description") {
                if (value !== null && typeof value !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: "Test tavsifi noto‘g‘ri."
                    });
                }

                if (typeof value === "string") value = value.trim();
            }

            if (input === "testType") {
                if (typeof value !== "string" || !value.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "Test turi noto‘g‘ri."
                    });
                }

                value = value.trim();
            }

            if (input === "courseId" || input === "lessonId") {
                if (value === "" || value === null) {
                    value = null;
                } else {
                    value = validId(value);

                    if (!value) {
                        return res.status(400).json({
                            success: false,
                            message: "Course yoki lesson ID noto‘g‘ri."
                        });
                    }
                }
            }

            if (input === "timeLimit") {
                if (value === "" || value === null) {
                    value = null;
                } else {
                    value = Number(value);

                    if (
                        !Number.isInteger(value) ||
                        value < 1 ||
                        value > 300
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "Test vaqti noto‘g‘ri."
                        });
                    }
                }
            }

            if (input === "passingScore") {
                value = Number(value);

                if (
                    !Number.isFinite(value) ||
                    value < 0 ||
                    value > 100
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "O‘tish foizi noto‘g‘ri."
                    });
                }
            }

            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }

        if (!fields.length) {
            return res.status(400).json({
                success: false,
                message: "Yangilash uchun ma’lumot yuborilmadi."
            });
        }

        fields.push("updated_at = NOW()");
        values.push(testId);

        const result = await pool.query(
            `UPDATE tests
             SET ${fields.join(", ")}
             WHERE id = $${values.length}
             RETURNING *`,
            values
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
});

// =========================================
// ADD QUESTION
// POST /api/tests/:id/questions
// Admin only
// =========================================

router.post("/:id/questions", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);

        if (!testId || !isObject(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Test ID yoki ma’lumot noto‘g‘ri."
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

        const parsedOrder =
            questionOrder === undefined || questionOrder === null
                ? 1
                : Number(questionOrder);

        const parsedPoints =
            points === undefined || points === null
                ? 1
                : Number(points);

        if (
            typeof question !== "string" ||
            !question.trim() ||
            !Array.isArray(options) ||
            options.length < 2 ||
            options.some(option =>
                option === null ||
                option === undefined ||
                (typeof option === "string" && !option.trim())
            ) ||
            correctAnswer === undefined ||
            correctAnswer === null ||
            !String(correctAnswer).trim() ||
            (explanation !== undefined &&
                explanation !== null &&
                typeof explanation !== "string") ||
            !Number.isInteger(parsedOrder) ||
            parsedOrder < 1 ||
            !Number.isFinite(parsedPoints) ||
            parsedPoints <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Savol, variantlar va javobni to‘g‘ri kiriting."
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
            `INSERT INTO test_questions (
                test_id,
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
                test_id,
                question,
                options,
                correct_answer,
                explanation,
                question_order,
                points`,
            [
                testId,
                question.trim(),
                JSON.stringify(options),
                String(correctAnswer).trim(),
                explanation ? explanation.trim() : null,
                parsedOrder,
                parsedPoints
            ]
        );

        res.status(201).json({
            success: true,
            question: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Bu tartib raqamida savol mavjud."
            });
        }

        next(error);
    }
});

// =========================================
// UPDATE QUESTION
// PUT /api/tests/:id/questions/:questionId
// Admin only
// =========================================

router.put("/:id/questions/:questionId", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);
        const questionId = validId(req.params.questionId);

        if (!testId || !questionId || !isObject(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Test yoki savol ID noto‘g‘ri."
            });
        }

        const allowedFields = {
            question: "question",
            options: "options",
            correctAnswer: "correct_answer",
            explanation: "explanation",
            questionOrder: "question_order",
            points: "points"
        };

        const fields = [];
        const values = [];

        for (const [input, column] of Object.entries(allowedFields)) {
            if (req.body[input] === undefined) continue;

            let value = req.body[input];

            if (input === "question") {
                if (typeof value !== "string" || !value.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "Savol matni noto‘g‘ri."
                    });
                }

                value = value.trim();
            }

            if (input === "options") {
                if (
                    !Array.isArray(value) ||
                    value.length < 2 ||
                    value.some(option =>
                        option === null ||
                        option === undefined ||
                        (typeof option === "string" && !option.trim())
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Javob variantlari noto‘g‘ri."
                    });
                }

                value = JSON.stringify(value);
            }

            if (input === "correctAnswer") {
                if (value === null || !String(value).trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "To‘g‘ri javob noto‘g‘ri."
                    });
                }

                value = String(value).trim();
            }

            if (input === "explanation") {
                if (value !== null && typeof value !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: "Izoh noto‘g‘ri."
                    });
                }

                if (typeof value === "string") value = value.trim();
            }

            if (input === "questionOrder") {
                value = Number(value);

                if (!Number.isInteger(value) || value < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Savol tartibi noto‘g‘ri."
                    });
                }
            }

            if (input === "points") {
                value = Number(value);

                if (!Number.isFinite(value) || value <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Savol balli noto‘g‘ri."
                    });
                }
            }

            values.push(value);
            fields.push(`${column} = $${values.length}`);
        }

        if (!fields.length) {
            return res.status(400).json({
                success: false,
                message: "Yangilash uchun ma’lumot yuborilmadi."
            });
        }

        values.push(testId);
        values.push(questionId);

        const result = await pool.query(
            `UPDATE test_questions
             SET ${fields.join(", ")}
             WHERE test_id = $${values.length - 1}
               AND id = $${values.length}
             RETURNING
                id,
                test_id,
                question,
                options,
                correct_answer,
                explanation,
                question_order,
                points`,
            values
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
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Bu tartib raqamida boshqa savol mavjud."
            });
        }

        next(error);
    }
});

// =========================================
// DELETE QUESTION
// DELETE /api/tests/:id/questions/:questionId
// Admin only
// =========================================

router.delete("/:id/questions/:questionId", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);
        const questionId = validId(req.params.questionId);

        if (!testId || !questionId) {
            return res.status(400).json({
                success: false,
                message: "Test yoki savol ID noto‘g‘ri."
            });
        }

        const result = await pool.query(
            `DELETE FROM test_questions
             WHERE test_id = $1
               AND id = $2
             RETURNING id, test_id`,
            [testId, questionId]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Savol topilmadi."
            });
        }

        res.json({
            success: true,
            message: "Savol o‘chirildi.",
            question: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// =========================================
// SUBMIT TEST
// POST /api/tests/:id/submit
// =========================================

router.post("/:id/submit", auth, async (req, res, next) => {
    let client;
    let transactionStarted = false;

    try {
        const testId = validId(req.params.id);

        if (
            !testId ||
            !isObject(req.body) ||
            !Array.isArray(req.body.answers)
        ) {
            return res.status(400).json({
                success: false,
                message: "Test yoki javoblar noto‘g‘ri."
            });
        }

        const answers = req.body.answers;

        client = await pool.connect();

        await client.query("BEGIN");
        transactionStarted = true;

        const testResult = await client.query(
            `SELECT id, passing_score
             FROM tests
             WHERE id = $1
               AND is_active = TRUE
             FOR UPDATE`,
            [testId]
        );

        if (!testResult.rows.length) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                success: false,
                message: "Test topilmadi yoki faol emas."
            });
        }

        const questionsResult = await client.query(
            `SELECT id, correct_answer, points
             FROM test_questions
             WHERE test_id = $1
             ORDER BY question_order ASC, id ASC`,
            [testId]
        );

        const questions = questionsResult.rows;

        if (!questions.length) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "Testda savollar mavjud emas."
            });
        }

        const submittedAnswers = new Map();

        for (const answer of answers) {
            if (!isObject(answer)) {
                await client.query("ROLLBACK");
                transactionStarted = false;

                return res.status(400).json({
                    success: false,
                    message: "Javoblar formati noto‘g‘ri."
                });
            }

            const questionId = validId(answer.questionId);

            if (
                !questionId ||
                answer.answer === undefined ||
                answer.answer === null ||
                submittedAnswers.has(questionId)
            ) {
                await client.query("ROLLBACK");
                transactionStarted = false;

                return res.status(400).json({
                    success: false,
                    message: "Javoblar noto‘g‘ri yoki takrorlangan."
                });
            }

            submittedAnswers.set(questionId, String(answer.answer));
        }

        const questionIds = new Set(
            questions.map(item => Number(item.id))
        );

        for (const questionId of submittedAnswers.keys()) {
            if (!questionIds.has(questionId)) {
                await client.query("ROLLBACK");
                transactionStarted = false;

                return res.status(400).json({
                    success: false,
                    message: "Testga tegishli bo‘lmagan savol yuborildi."
                });
            }
        }

        let correctCount = 0;
        let earnedPoints = 0;
        let totalPoints = 0;

        for (const question of questions) {
            const questionPoints = Number(question.points);

            if (!Number.isFinite(questionPoints) || questionPoints <= 0) {
                throw new Error("Test savolining ball qiymati noto‘g‘ri.");
            }

            totalPoints += questionPoints;

            const submitted = submittedAnswers.get(Number(question.id));

            if (
                submitted !== undefined &&
                submitted === String(question.correct_answer)
            ) {
                correctCount++;
                earnedPoints += questionPoints;
            }
        }

        if (totalPoints <= 0) {
            throw new Error("Testning umumiy ball qiymati noto‘g‘ri.");
        }

        const score = Number(
            ((earnedPoints / totalPoints) * 100).toFixed(2)
        );

        const passingScore = Number(testResult.rows[0].passing_score);
        const passed = score >= passingScore;

        const attemptResult = await client.query(
            `INSERT INTO test_attempts (
                user_id,
                test_id,
                answers,
                score,
                correct_answers,
                total_questions,
                passed,
                started_at,
                completed_at
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
             RETURNING
                id,
                test_id,
                answers,
                score,
                correct_answers,
                total_questions,
                passed,
                started_at,
                completed_at,
                created_at`,
            [
                req.user.id,
                testId,
                JSON.stringify(Object.fromEntries(submittedAnswers)),
                score,
                correctCount,
                questions.length,
                passed
            ]
        );

        await client.query("COMMIT");
        transactionStarted = false;

        res.json({
            success: true,
            message: "Test natijasi saqlandi.",
            result: attemptResult.rows[0]
        });
    } catch (error) {
        if (client && transactionStarted) {
            try {
                await client.query("ROLLBACK");
            } catch (rollbackError) {
                // Asosiy xatoni saqlab qolamiz.
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
// ACTIVATE / DEACTIVATE TEST
// PATCH /api/tests/:id/status
// Admin only
// =========================================

router.patch("/:id/status", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);

        if (
            !testId ||
            !isObject(req.body) ||
            typeof req.body.isActive !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "Test ID yoki holati noto‘g‘ri."
            });
        }

        const result = await pool.query(
            `UPDATE tests
             SET is_active = $1,
                 updated_at = NOW()
             WHERE id = $2
             RETURNING id, title, is_active, updated_at`,
            [req.body.isActive, testId]
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
});

// =========================================
// DELETE TEST (SOFT DELETE)
// DELETE /api/tests/:id
// Admin only
// =========================================

router.delete("/:id", auth, admin, async (req, res, next) => {
    try {
        const testId = validId(req.params.id);

        if (!testId) {
            return res.status(400).json({
                success: false,
                message: "Test ID noto‘g‘ri."
            });
        }

        const result = await pool.query(
            `UPDATE tests
             SET is_active = FALSE,
                 updated_at = NOW()
             WHERE id = $1
               AND is_active = TRUE
             RETURNING id, title, is_active, updated_at`,
            [testId]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Test topilmadi yoki allaqachon o‘chirilgan."
            });
        }

        res.json({
            success: true,
            message: "Test o‘chirildi.",
            test: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
