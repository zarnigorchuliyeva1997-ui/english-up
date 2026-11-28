
const rateLimit = require("express-rate-limit");

// =========================================
// GENERAL API RATE LIMIT
// =========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "So'rovlar soni chegarasiga yetdingiz. Birozdan keyin qayta urinib ko'ring."
  }
});

// =========================================
// LOGIN AND REGISTRATION RATE LIMIT
// =========================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    success: false,
    message: "Kirish urinishlari ko'p bo'ldi. 15 daqiqadan keyin qayta urinib ko'ring."
  }
});

// =========================================
// PASSWORD RESET RATE LIMIT
// =========================================

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Parolni tiklash so'rovlari chegarasiga yetdingiz. Keyinroq urinib ko'ring."
  }
});

// =========================================
// EXPORTS
// =========================================

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter
};
