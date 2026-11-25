
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
    "Obuna muddati noto'g'ri": 400,
    "Obuna rejasi ko'rsatilmagan": 400,
    "O'quvchi topilmadi": 404,
    "Aktivatsiya kodi kiritilmagan": 400,
    "Aktivatsiya kodi noto'g'ri": 404,
    "Bu kod boshqa foydalanuvchiga biriktirilgan": 403,
    "Bu kod avval ishlatilgan": 409,
    "Aktivatsiya kodining muddati tugagan": 410,
    "Kod topilmadi yoki u allaqachon ishlatilgan": 404
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
        code.trim()
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
