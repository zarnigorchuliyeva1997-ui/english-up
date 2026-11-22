
const express = require("express");
const router = express.Router();

const {
  createActivationCode,
  redeemActivationCode
} = require("../services/activationCodeService");

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

function handleError(error) {
  const messages = {
    "Subscription details are invalid": 400,
    "Invalid activation code details": 400,
    "User not found or inactive": 404,
    "Student not found or inactive": 404,
    "Invalid activation code": 404,
    "This code belongs to another account": 403,
    "This code has already been used": 409,
    "Activation code has expired": 410
  };

  if (messages[error.message]) {
    error.statusCode = messages[error.message];
  }

  return error;
}

// Admin: akkauntga biriktirilgan kod yaratish
router.post(
  "/admin/create",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, plan, durationDays } = req.body || {};

      const result = await createActivationCode({
        userId,
        plan,
        durationDays
      });

      res.status(201).json({
        success: true,
        message: "Activation code created",
        code: result.activationCode,
        details: result.details
      });
    } catch (error) {
      next(handleError(error));
    }
  }
);

// O'quvchi: o'z kodini ishlatish
router.post(
  "/redeem",
  authenticateToken,
  async (req, res, next) => {
    try {
      const { code } = req.body || {};

      if (typeof code !== "string" || !code.trim()) {
        return res.status(400).json({
          success: false,
          message: "Activation code is required"
        });
      }

      const result = await redeemActivationCode(
        req.user.id,
        code
      );

      res.json({
        success: true,
        message: "Subscription activated successfully",
        subscription: result.subscription
      });
    } catch (error) {
      next(handleError(error));
    }
  }
);

module.exports = router;
