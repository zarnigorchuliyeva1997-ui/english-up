
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../services/authService");

// =========================================
// REGISTER
// =========================================

router.post("/register", async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      ...result
    });
  } catch (error) {
    const message = String(error.message || "");

    if (message === "This email is already registered") {
      error.statusCode = 409;
    } else if (
      message.includes("required") ||
      message.includes("valid") ||
      message.includes("between")
    ) {
      error.statusCode = 400;
    }

    next(error);
  }
});

// =========================================
// LOGIN
// =========================================

router.post("/login", async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    const message = String(error.message || "");

    if (message === "Invalid email or password") {
      error.statusCode = 401;
    } else if (
      message.includes("required") ||
      message.includes("valid")
    ) {
      error.statusCode = 400;
    } else if (message === "Account is inactive") {
      error.statusCode = 403;
    }

    next(error);
  }
});

module.exports = router;
