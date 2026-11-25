
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const {
  getActiveSubscription,
  activateSubscription
} = require("../services/subscriptionService");

// =========================================
// HELPERS
// =========================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

// =========================================
// GET MY ACTIVE SUBSCRIPTION
// GET /api/subscriptions/me
// =========================================

router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const subscription = await getActiveSubscription(req.user.id);

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    next(error);
  }
});

// =========================================
// ADMIN ACTIVATE SUBSCRIPTION
// POST /api/subscriptions/admin/activate
// =========================================

router.post(
  "/admin/activate",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!isObject(req.body)) {
        return res.status(400).json({
          success: false,
          message: "Yuborilgan ma'lumot noto'g'ri."
        });
      }

      const { userId, plan, durationDays } = req.body;

      const parsedUserId = Number(userId);
      const parsedDuration = Number(durationDays);

      if (
        !Number.isInteger(parsedUserId) ||
        parsedUserId < 1 ||
        typeof plan !== "string" ||
        !plan.trim() ||
        !Number.isInteger(parsedDuration) ||
        parsedDuration < 1 ||
        parsedDuration > 3650
      ) {
        return res.status(400).json({
          success: false,
          message: "User ID, tarif yoki obuna muddati noto'g'ri."
        });
      }

      const subscription = await activateSubscription({
        userId: parsedUserId,
        plan: plan.trim(),
        durationDays: parsedDuration
      });

      res.status(201).json({
        success: true,
        message: "Subscription activated",
        subscription
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
