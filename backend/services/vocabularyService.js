
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getVocabulary(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const conditions = [];
  const values = [];

  if (query.level) {
    values.push(query.level);
    conditions.push(`level = $${values.length}`);
  }

  if (query.day) {
    const day = Number(query.day);

    if (!Number.isInteger(day) || day < 1) {
      throw new Error("Kun raqami noto'g'ri.");
    }

    values.push(day);
    conditions.push(`day_number = $${values.length}`);
  }

  if (query.search) {
    values.push(`%${String(query.search).trim()}%`);
    conditions.push(
      `(word ILIKE $${values.length} OR translation ILIKE $${values.length})`
    );
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const listValues = [...values, limit, offset];

  const result = await pool.query(
    `SELECT id, level, day_number, word, translation,
            pronunciation, example
     FROM vocabulary
     ${where}
     ORDER BY level, day_number, id
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    listValues
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM vocabulary ${where}`,
    values
  );

  return {
    words: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

async function getDailyVocabulary(level, day) {
  const result = await pool.query(
    `SELECT id, word, translation, pronunciation, example
     FROM vocabulary
     WHERE level = $1 AND day_number = $2
     ORDER BY id ASC`,
    [level, day]
  );

  return result.rows;
}

async function createVocabulary(data) {
  const {
    level,
    dayNumber,
    word,
    translation,
    pronunciation,
    example
  } = data;

  const result = await pool.query(
    `INSERT INTO vocabulary (
       level, day_number, word, translation, pronunciation, example
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      level,
      dayNumber,
      word.trim(),
      translation.trim(),
      pronunciation || null,
      example || null
    ]
  );

  return result.rows[0];
}

async function updateVocabulary(wordId, data) {
  const {
    level,
    dayNumber,
    word,
    translation,
    pronunciation,
    example
  } = data;

  const result = await pool.query(
    `UPDATE vocabulary
     SET level = COALESCE($2, level),
         day_number = COALESCE($3, day_number),
         word = COALESCE($4, word),
         translation = COALESCE($5, translation),
         pronunciation = COALESCE($6, pronunciation),
         example = COALESCE($7, example)
     WHERE id = $1
     RETURNING *`,
    [
      wordId,
      level ?? null,
      dayNumber ?? null,
      word?.trim() ?? null,
      translation?.trim() ?? null,
      pronunciation ?? null,
      example ?? null
    ]
  );

  return result.rows[0] || null;
}

async function deleteVocabulary(wordId) {
  const result = await pool.query(
    `DELETE FROM vocabulary
     WHERE id = $1
     RETURNING id`,
    [wordId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getVocabulary,
  getDailyVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary
};
