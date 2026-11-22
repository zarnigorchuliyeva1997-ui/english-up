
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const {
  getCurrentSubscription,
  activateSubscription
} = require("../services/subscriptionService");

// O'quvchi o'z obunasini ko'radi
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const subscription = await getCurrentSubscription(req.user.id);

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    next(error);
  }
});

// Admin o'quvchiga obuna beradi
router.post(
  "/admin/activate",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, plan, durationDays } = req.body;

      const subscription = await activateSubscription({
        userId,
        plan,
        durationDays
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
