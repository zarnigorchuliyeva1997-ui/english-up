
const express = require("express");
const router = express.Router();

const {
  createActivationCode,
  verifyActivationCode,
  redeemActivationCode,
  getActivationCodes,
  revokeActivationCode
} = require("../services/activationCodeService");

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

function handleError(error) {
  const messages = {
    "Obuna muddati noto'g'ri": 400,
    "Obuna rejasi noto'g'ri": 400,
    "O'quvchi email manzili ko'rsatilmagan": 400,
    "O'quvchi topilmadi": 404,
    "Aktivatsiya kodi kiritilmagan": 400,
    "Aktivatsiya kodi noto'g'ri": 404,
    "Bu kod boshqa foydalanuvchiga biriktirilgan": 403,
    "Bu kod avval ishlatilgan": 409,
    "Aktivatsiya kodining muddati tugagan": 410,
    "Kod topilmadi yoki u allaqachon ishlatilgan": 404,
    "Email manzili kiritilmagan": 400,
    "Kodning amal qilish sanasi noto'g'ri": 400
  };

  if (messages[error.message]) {
    error.statusCode = messages[error.message];
  }

  return error;
}

// O'quvchi: kod va email mosligini tekshirish
router.post("/check", async (req, res, next) => {
  try {
    const { code, email } = req.body || {};

    const result = await verifyActivationCode(code, email);

    res.json({
      success: true,
      message: "Activation code is valid",
      details: result
    });
  } catch (error) {
    next(handleError(error));
  }
});

// Admin: kodlar ro'yxati
router.get(
  "/admin/list",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await getActivationCodes({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        plan: req.query.plan
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(handleError(error));
    }
  }
);

// Admin: Gmail uchun bitta yoki bir nechta kod yaratish
router.post(
  "/admin/create",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const {
        email,
        plan,
        durationDays,
        quantity = 1
      } = req.body || {};

      const count = Number(quantity);

      if (!Number.isInteger(count) || count < 1 || count > 100) {
        return res.status(400).json({
          success: false,
          message: "Kodlar soni 1 dan 100 gacha bo'lishi kerak."
        });
      }

      const created = [];

      for (let i = 0; i < count; i++) {
        const result = await createActivationCode({
          email,
          plan,
          durationDays
        });

        created.push({
          id: result.details.id,
          code: result.activationCode,
          email: result.email,
          plan: result.details.plan,
          durationDays: result.details.duration_days,
          createdAt: result.details.created_at,
          expiresAt: result.details.expires_at
        });
      }

      res.status(201).json({
        success: true,
        message: `${created.length} ta kod yaratildi.`,
        items: created
      });
    } catch (error) {
      next(handleError(error));
    }
  }
);

// Admin: ishlatilmagan kodni bekor qilish
router.delete(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await revokeActivationCode(req.params.id);

      res.json({
        success: true,
        message: "Activation code cancelled",
        id: result.id
      });
    } catch (error) {
      next(handleError(error));
    }
  }
);

// O'quvchi: o'z kodini obunaga aylantirish
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
