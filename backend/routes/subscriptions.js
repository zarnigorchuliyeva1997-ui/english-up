const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const {
  getActiveSubscription,
  activateSubscription,
  getAllSubscriptions,
  updateSubscriptionStatus
} = require("../services/subscriptionService");

// =========================================
// HELPERS
// =========================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const ALLOWED_STATUSES = [
  "active",
  "expired",
  "cancelled",
  "pending"
];

const ALLOWED_PLANS = [
  "monthly",
  "quarterly",
  "yearly"
];

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
// ADMIN — LIST ALL SUBSCRIPTIONS
// GET /api/subscriptions/admin?page=1&limit=20
// =========================================

router.get(
  "/admin",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await getAllSubscriptions({
        page: req.query.page,
        limit: req.query.limit
      });

      res.json({
        success: true,
        subscriptions: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// ADMIN — ACTIVATE SUBSCRIPTION
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
        !ALLOWED_PLANS.includes(plan.trim()) ||
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

// =========================================
// ADMIN — UPDATE SUBSCRIPTION STATUS
// PUT /api/subscriptions/admin/:id/status
// =========================================

router.put(
  "/admin/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const subscriptionId = Number(req.params.id);

      if (!Number.isInteger(subscriptionId) || subscriptionId < 1) {
        return res.status(400).json({
          success: false,
          message: "Subscription ID noto'g'ri."
        });
      }

      if (!isObject(req.body)) {
        return res.status(400).json({
          success: false,
          message: "Yuborilgan ma'lumot noto'g'ri."
        });
      }

      const { status } = req.body;

      if (
        typeof status !== "string" ||
        !ALLOWED_STATUSES.includes(status.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: `Status noto'g'ri. Ruxsat etilgan: ${ALLOWED_STATUSES.join(", ")}`
        });
      }

      const subscription = await updateSubscriptionStatus(
        subscriptionId,
        status.trim()
      );

      res.json({
        success: true,
        message: "Subscription status updated",
        subscription
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
