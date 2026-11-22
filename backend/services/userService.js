
const { pool } = require("../config/database");

async function getAllUsers({ page = 1, limit = 50, search = "" } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50));
  const offset = (safePage - 1) * safeLimit;

  const values = [];
  let where = "";

  if (search.trim()) {
    values.push(`%${search.trim()}%`);
    where = `WHERE name ILIKE $1 OR email ILIKE $1`;
  }

  values.push(safeLimit, offset);

  const result = await pool.query(
    `SELECT id, name, email, role, level, is_active, created_at
     FROM users
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return result.rows;
}

async function getUserById(userId) {
  const result = await pool.query(
    `SELECT id, name, email, role, level, is_active, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

async function updateUser(userId, { name, email, level } = {}) {
  const fields = [];
  const values = [];

  if (name !== undefined) {
    values.push(name.trim());
    fields.push(`name = $${values.length}`);
  }

  if (email !== undefined) {
    values.push(email.trim().toLowerCase());
    fields.push(`email = $${values.length}`);
  }

  if (level !== undefined) {
    values.push(level);
    fields.push(`level = $${values.length}`);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(userId);

  const result = await pool.query(
    `UPDATE users
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING id, name, email, role, level, is_active, created_at`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

async function setUserActiveStatus(userId, isActive) {
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be true or false");
  }

  const result = await pool.query(
    `UPDATE users
     SET is_active = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, role, level, is_active`,
    [isActive, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

async function deleteUser(userId) {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1 AND role <> 'admin'
     RETURNING id`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found or admin account cannot be deleted");
  }

  return { success: true };
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  setUserActiveStatus,
  deleteUser
};
