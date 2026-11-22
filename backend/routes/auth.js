
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../services/authService");

router.post("/register", async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      ...result
    });
  } catch (error) {
    if (error.message === "This email is already registered") {
      error.statusCode = 409;
    } else if (
      error.message.includes("required") ||
      error.message.includes("at least")
    ) {
      error.statusCode = 400;
    }

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    if (
      error.message === "Invalid email or password" ||
      error.message.includes("required")
    ) {
      error.statusCode = 401;
    }

    next(error);
  }
});

module.exports = router;
