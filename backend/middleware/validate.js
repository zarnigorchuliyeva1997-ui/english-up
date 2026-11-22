
function validate(fields) {
  return function (req, res, next) {
    const errors = [];

    for (const field of fields) {
      const value = req.body?.[field.name];

      if (field.required && (
        value === undefined ||
        value === null ||
        value === ""
      )) {
        errors.push(`${field.name} maydoni majburiy.`);
        continue;
      }

      if (value === undefined || value === null) {
        continue;
      }

      if (field.type && typeof value !== field.type) {
        errors.push(`${field.name} noto'g'ri formatda.`);
        continue;
      }

      if (
        typeof value === "string" &&
        field.minLength &&
        value.trim().length < field.minLength
      ) {
        errors.push(
          `${field.name} kamida ${field.minLength} ta belgidan iborat bo'lishi kerak.`
        );
      }

      if (
        typeof value === "string" &&
        field.maxLength &&
        value.length > field.maxLength
      ) {
        errors.push(
          `${field.name} ko'pi bilan ${field.maxLength} ta belgidan iborat bo'lishi mumkin.`
        );
      }

      if (
        field.pattern &&
        typeof value === "string" &&
        !field.pattern.test(value)
      ) {
        errors.push(`${field.name} formati noto'g'ri.`);
      }

      if (
        field.allowedValues &&
        !field.allowedValues.includes(value)
      ) {
        errors.push(`${field.name} qiymati ruxsat etilmagan.`);
      }
    }

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: "Yuborilgan ma'lumotlarni tekshiring.",
        errors
      });
    }

    next();
  };
}

// Email tekshirish
function isValidEmail(email) {
  if (typeof email !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ID tekshirish
function isValidId(id) {
  return (
    typeof id === "string" &&
    /^\d+$/.test(id)
  );
}

module.exports = {
  validate,
  isValidEmail,
  isValidId
};
