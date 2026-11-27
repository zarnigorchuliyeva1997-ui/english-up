
const express = require("express");
const router = express.Router();

const {
  createActivationCodes,
  verifyActivationCode,
  redeemActivationCode,
  getActivationCodes,
  revokeActivationCode
} = require("../services/activationCodeService");

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

function sendError(res, error) {
  const status = error.statusCode || 500;

  if (status >= 500) {
    console.error("Activation code error:", error);
  }

  return res.status(status).json({
    success: false,
    message: error.message || "Serverda xatolik yuz berdi."
  });
}

// Aktivatsiya kodini tekshirish
router.post("/check", async (req, res) => {
  try {
    const { code, email } = req.body || {};

    if (!code || !email) {
      return res.status(400).json({
        success: false,
        message: "Kod va email kiritilishi kerak."
      });
    }

    const result = await verifyActivationCode(
      String(code).trim(),
      String(email).trim().toLowerCase()
    );

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// Admin: aktivatsiya kodlari ro‘yxati
router.get(
  "/admin/list",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await getActivationCodes({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        plan: req.query.plan
      });

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
);

// Admin: yangi kodlar yaratish
router.post(
  "/admin/create",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { email, plan, durationDays, quantity, note } = req.body || {};

      const normalizedEmail = String(email || "").trim().toLowerCase();
      const normalizedPlan = String(plan || "").trim();
      const days = Number(durationDays);
      const amount = Number(quantity ?? 1);

      if (!normalizedEmail || !normalizedPlan) {
        return res.status(400).json({
          success: false,
          message: "Email va obuna rejasi kiritilishi kerak."
        });
      }

      if (
        !Number.isInteger(days) ||
        days < 1 ||
        days > 3650
      ) {
        return res.status(400).json({
          success: false,
          message: "Obuna muddati noto‘g‘ri."
        });
      }

      if (
        !Number.isInteger(amount) ||
        amount < 1 ||
        amount > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Kodlar soni 1 dan 100 gacha bo‘lishi kerak."
        });
      }

      const items = await createActivationCodes({
        email: normalizedEmail,
        plan: normalizedPlan,
        durationDays: days,
        quantity: amount,
        note: String(note || "").trim()
      });

      return res.status(201).json({
        success: true,
        message: `${items.length} ta aktivatsiya kodi yaratildi.`,
        items
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
);

// Admin: kodni bekor qilish
router.delete(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Aktivatsiya kodi ID raqami noto‘g‘ri."
        });
      }

      const result = await revokeActivationCode(id);

      return res.json({
        success: true,
        message: "Aktivatsiya kodi bekor qilindi.",
        item: result
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
);

// O‘quvchi: kodni ishlatish
router.post(
  "/redeem",
  authenticateToken,
  async (req, res) => {
    try {
      const code = String(req.body?.code || "").trim();

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Aktivatsiya kodini kiriting."
        });
      }

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Foydalanuvchi sessiyasi topilmadi."
        });
      }

      const result = await redeemActivationCode(userId, code);

      return res.json({
        success: true,
        message: "Obuna muvaffaqiyatli faollashtirildi.",
        subscription: result
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
);

module.exports = router;
