
const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function normalizeEmail(email) {
  if (typeof email !== "string") {
    throw new Error("A valid email is required");
  }

  const normalized = email.trim().toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalized)) {
    throw new Error("A valid email is required");
  }

  return normalized;
}

async function registerUser({ name, email, password } = {}) {
  if (
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Name, email and password are required");
  }

  const normalizedName = name.trim();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    throw new Error("Name must be between 2 and 100 characters");
  }

  if (password.length < 8 || password.length > 128) {
    throw new Error("Password must be between 8 and 128 characters");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const normalizedEmail = normalizeEmail(email);

  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (existing.rows.length > 0) {
    throw new Error("This email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      `INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, 'student')
      RETURNING
        id,
        name,
        email,
        role,
        level,
        is_active,
        created_at`,
      [normalizedName, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    return {
      user,
      token: createToken(user)
    };
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("This email is already registered");
    }

    throw error;
  }
}

async function loginUser({ email, password } = {}) {
  if (
    typeof password !== "string" ||
    password.length === 0
  ) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = normalizeEmail(email);

  const result = await pool.query(
    `SELECT
      id,
      name,
      email,
      password_hash,
      role,
      level,
      is_active,
      created_at
    FROM users
    WHERE email = $1`,
    [normalizedEmail]
  );

  const user = result.rows[0];

  if (
    !user ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    is_active: user.is_active,
    created_at: user.created_at
  };

  return {
    user: safeUser,
    token: createToken(safeUser)
  };
}

module.exports = {
  registerUser,
  loginUser
};
