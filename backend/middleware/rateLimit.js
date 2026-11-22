
const rateLimit = require("express-rate-limit");

// Umumiy API so'rovlarini cheklash
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "So'rovlar soni chegarasiga yetdingiz. Birozdan keyin qayta urinib ko'ring."
  }
});

// Login va ro'yxatdan o'tishni kuchliroq himoyalash
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Kirish urinishlari ko'p bo'ldi. 15 daqiqadan keyin qayta urinib ko'ring."
  }
});

// Parolni tiklash so'rovlari uchun
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Parolni tiklash so'rovlari chegarasiga yetdingiz. Keyinroq urinib ko'ring."
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter
};
