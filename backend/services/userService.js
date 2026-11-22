
const { pool } = require("../config/database");
const { getPagination } = require("../utils/pagination");

async function getUserById(userId) {
  const result = await pool.query(
    `SELECT id, name, email, role, level, is_active, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, role, level, is_active, created_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

async function updateUser(userId, data) {
  const { name, level } = data;

  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($2, name),
         level = COALESCE($3, level),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, role, level, is_active, updated_at`,
    [userId, name ?? null, level ?? null]
  );

  return result.rows[0] || null;
}

async function setUserStatus(userId, isActive) {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, role, is_active`,
    [userId, isActive]
  );

  return result.rows[0] || null;
}

async function getUsers(query = {}) {
  const { page, limit, offset } = getPagination(query);

  const result = await pool.query(
    `SELECT id, name, email, role, level, is_active, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await pool.query(
    "SELECT COUNT(*) FROM users"
  );

  return {
    users: result.rows,
    page,
    limit,
    total: Number(countResult.rows[0].count)
  };
}

module.exports = {
  getUserById,
  getUserByEmail,
  updateUser,
  setUserStatus,
  getUsers
};
