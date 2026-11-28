const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const allowedLevels = [
    "beginner",
    "elementary",
    "pre-intermediate",
    "intermediate",
    "upper-intermediate",
    "ielts"
];

async function hasActiveSubscription(userId) {
    const result = await pool.query(
        `SELECT id
         FROM subscriptions
         WHERE user_id = $1
           AND status = 'active'
           AND start_date <= CURRENT_DATE
           AND end_date >= CURRENT_DATE
         LIMIT 1`,
        [userId]
    );

    return result.rows.length > 0;
}

// ADMIN: Barcha lug'at so'zlarini olish
router.get(
    "/admin/all",
    authenticateToken,
    requireAdmin,
    async (req, res, next) => {
        try {
            const { level, dayNumber, search } = req.query;

            const conditions = [];
            const values = [];

            if (level) {
                if (!allowedLevels.includes(level)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid vocabulary level"
                    });
                }

                values.push(level);
                conditions.push(`level = $${values.length}`);
            }

            if (dayNumber !== undefined) {
                const day = Number(dayNumber);

                if (!Number.isInteger(day) || day < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid day number"
                    });
                }

                values.push(day);
                conditions.push(`day_number = $${values.length}`);
            }

            if (search && String(search).trim()) {
                values.push(`%${String(search).trim()}%`);
                conditions.push(
                    `(word ILIKE $${values.length}
                      OR translation ILIKE $${values.length}
                      OR pronunciation ILIKE $${values.length})`
                );
            }

            const where = conditions.length
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

            const result = await pool.query(
                `SELECT
                    id,
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example,
                    created_at
                 FROM vocabulary
                 ${where}
                 ORDER BY level ASC, day_number ASC, id ASC`,
                values
            );

            res.json({
                success: true,
                words: result.rows,
                total: result.rows.length
            });
        } catch (error) {
            next(error);
        }
    }
);

// FOYDALANUVCHI: Lug'at so'zlarini olish
router.get(
    "/",
    authenticateToken,
    async (req, res, next) => {
        try {
            const { level, day } = req.query;

            if (!allowedLevels.includes(level)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vocabulary level"
                });
            }

            const access = await hasActiveSubscription(req.user.id);

            if (!access) {
                return res.status(403).json({
                    success: false,
                    message: "Active subscription required"
                });
            }

            const values = [level];

            let query = `
                SELECT
                    id,
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example
                FROM vocabulary
                WHERE level = $1
            `;

            if (day !== undefined) {
                const dayNumber = Number(day);

                if (!Number.isInteger(dayNumber) || dayNumber < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid day number"
                    });
                }

                values.push(dayNumber);
                query += " AND day_number = $2";
            }

            query += " ORDER BY day_number ASC, id ASC";

            const result = await pool.query(query, values);

            res.json({
                success: true,
                words: result.rows
            });
        } catch (error) {
            next(error);
        }
    }
);

// ADMIN: Yangi so'z qo'shish
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    async (req, res, next) => {
        try {
            const {
                level,
                dayNumber,
                word,
                translation,
                pronunciation,
                example
            } = req.body || {};

            if (
                !allowedLevels.includes(level) ||
                !Number.isInteger(dayNumber) ||
                dayNumber < 1 ||
                typeof word !== "string" ||
                !word.trim() ||
                typeof translation !== "string" ||
                !translation.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vocabulary information"
                });
            }

            const result = await pool.query(
                `INSERT INTO vocabulary (
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING
                    id,
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example,
                    created_at`,
                [
                    level,
                    dayNumber,
                    word.trim(),
                    translation.trim(),
                    typeof pronunciation === "string"
                        ? pronunciation.trim() || null
                        : null,
                    typeof example === "string"
                        ? example.trim() || null
                        : null
                ]
            );

            res.status(201).json({
                success: true,
                word: result.rows[0]
            });
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "This word already exists for this level and day."
                });
            }

            next(error);
        }
    }
);

// ADMIN: So'zni tahrirlash
router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res, next) => {
        try {
            const wordId = Number(req.params.id);

            if (!Number.isSafeInteger(wordId) || wordId < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vocabulary ID"
                });
            }

            const {
                level,
                dayNumber,
                word,
                translation,
                pronunciation,
                example
            } = req.body || {};

            const updates = {
                level,
                day_number: dayNumber,
                word,
                translation,
                pronunciation,
                example
            };

            if (level !== undefined && !allowedLevels.includes(level)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vocabulary level"
                });
            }

            if (
                dayNumber !== undefined &&
                (!Number.isInteger(dayNumber) || dayNumber < 1)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid day number"
                });
            }

            if (
                word !== undefined &&
                (typeof word !== "string" || !word.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid word value"
                });
            }

            if (
                translation !== undefined &&
                (typeof translation !== "string" || !translation.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid translation value"
                });
            }

            for (const field of ["pronunciation", "example"]) {
                const value = updates[field];

                if (
                    value !== undefined &&
                    value !== null &&
                    typeof value !== "string"
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid ${field} value`
                    });
                }
            }

            const fields = [];
            const values = [];

            for (const [column, value] of Object.entries(updates)) {
                if (value === undefined) continue;

                let normalized = value;

                if (typeof normalized === "string") {
                    normalized = normalized.trim();
                }

                if (
                    (column === "pronunciation" || column === "example") &&
                    normalized === ""
                ) {
                    normalized = null;
                }

                values.push(normalized);
                fields.push(`${column} = $${values.length}`);
            }

            if (fields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No vocabulary fields provided"
                });
            }

            values.push(wordId);

            const result = await pool.query(
                `UPDATE vocabulary
                 SET ${fields.join(", ")}
                 WHERE id = $${values.length}
                 RETURNING
                    id,
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example,
                    created_at`,
                values
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Vocabulary word not found"
                });
            }

            res.json({
                success: true,
                word: result.rows[0]
            });
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "This word already exists for this level and day."
                });
            }

            next(error);
        }
    }
);

// ADMIN: So'zni o'chirish
router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    async (req, res, next) => {
        try {
            const wordId = Number(req.params.id);

            if (!Number.isSafeInteger(wordId) || wordId < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vocabulary ID"
                });
            }

            const result = await pool.query(
                `DELETE FROM vocabulary
                 WHERE id = $1
                 RETURNING
                    id,
                    level,
                    day_number,
                    word,
                    translation,
                    pronunciation,
                    example`,
                [wordId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Vocabulary word not found"
                });
            }

            res.json({
                success: true,
                message: "Vocabulary word deleted",
                word: result.rows[0]
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
