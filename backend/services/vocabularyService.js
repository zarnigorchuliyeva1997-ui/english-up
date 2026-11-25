
const { pool } = require("../config/database");

async function getVocabulary({
  level,
  dayNumber,
  page = 1,
  limit = 100
} = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(
    500,
    Math.max(1, Number.parseInt(limit, 10) || 100)
  );

  const conditions = [];
  const values = [];

  if (level) {
    values.push(level);
    conditions.push(`level = $${values.length}`);
  }

  if (dayNumber !== undefined && dayNumber !== null) {
    values.push(dayNumber);
    conditions.push(`day_number = $${values.length}`);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  values.push(safeLimit, (safePage - 1) * safeLimit);

  const result = await pool.query(
    `SELECT *
     FROM vocabulary
     ${where}
     ORDER BY id ASC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return result.rows;
}

async function getWordById(wordId) {
  const result = await pool.query(
    `SELECT *
     FROM vocabulary
     WHERE id = $1`,
    [wordId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vocabulary word not found");
  }

  return result.rows[0];
}

async function createWord({
  word,
  translation,
  pronunciation = "",
  example = "",
  level,
  dayNumber = null
}) {
  if (!word || !translation || !level) {
    throw new Error("Word, translation and level are required");
  }

  const result = await pool.query(
    `INSERT INTO vocabulary
      (word, translation, pronunciation, example, level, day_number)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      word.trim(),
      translation.trim(),
      pronunciation,
      example,
      level,
      dayNumber
    ]
  );

  return result.rows[0];
}

async function updateWord(wordId, data = {}) {
  const allowedFields = {
    word: "word",
    translation: "translation",
    pronunciation: "pronunciation",
    example: "example",
    level: "level",
    dayNumber: "day_number"
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
    throw new Error("No vocabulary fields provided");
  }

  values.push(wordId);

  const result = await pool.query(
    `UPDATE vocabulary
     SET ${fields.join(", ")}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Vocabulary word not found");
  }

  return result.rows[0];
}

async function deleteWord(wordId) {
  const result = await pool.query(
    `DELETE FROM vocabulary
     WHERE id = $1
     RETURNING id`,
    [wordId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vocabulary word not found");
  }

  return { success: true };
}

module.exports = {
  getVocabulary,
  getWordById,
  createWord,
  updateWord,
  deleteWord
};
