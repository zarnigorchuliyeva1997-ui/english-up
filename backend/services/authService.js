
"use strict";

const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================================
// TOKEN CONFIGURATION
// =========================================

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || typeof secret !== "string") {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

// =========================================
// CREATE JWT TOKEN
// =========================================

function createToken(user) {
  if (!user || !user.id || !user.role) {
    throw new Error("Invalid user information");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    getJwtSecret(),
    {
      algorithm: "HS256",
      expiresIn: "7d"
    }
  );
}

// =========================================
// NORMALIZE EMAIL
// =========================================

function normalizeEmail(email) {
  if (typeof email !== "string") {
    throw new Error("A valid email is required");
  }

  const normalized = email.trim().toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(normalized) ||
    normalized.length > 255
  ) {
    throw new Error("A valid email is required");
  }

  return normalized;
}

// =========================================
// VALIDATE REGISTRATION DATA
// =========================================

function validateRegistration({ name, email, password } = {}) {
  if (
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Name, email and password are required");
  }

  const normalizedName = name.trim();

  if (
    normalizedName.length < 2 ||
    normalizedName.length > 100
  ) {
    throw new Error(
      "Name must be between 2 and 100 characters"
    );
  }

  if (
    password.length < 8 ||
    password.length > 128
  ) {
    throw new Error(
      "Password must be between 8 and 128 characters"
    );
  }

  const passwordBytes = Buffer.byteLength(password, "utf8");

  if (passwordBytes > 72) {
    throw new Error(
      "Password must not exceed 72 UTF-8 bytes"
    );
  }

  return {
    name: normalizedName,
    email: normalizeEmail(email),
    password
  };
}

// =========================================
// REGISTER USER
// =========================================

async function registerUser(data = {}) {
  const validated = validateRegistration(data);

  getJwtSecret();

  const passwordHash = await bcrypt.hash(
    validated.password,
    12
  );

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
      [
        validated.name,
        validated.email,
        passwordHash
      ]
    );

    const user = result.rows[0];

    return {
      user,
      token: createToken(user)
    };

  } catch (error) {
    if (error.code === "23505") {
      throw new Error(
        "This email is already registered"
      );
    }

    throw error;
  }
}

// =========================================
// LOGIN USER
// =========================================

async function loginUser({ email, password } = {}) {
  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 1024
  ) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = normalizeEmail(email);

  getJwtSecret();

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
    WHERE email = $1
    LIMIT 1`,
    [normalizedEmail]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  if (user.is_active !== true) {
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

// =========================================
// EXPORTS
// =========================================

module.exports = {
  registerUser,
  loginUser,
  createToken,
  normalizeEmail
};
