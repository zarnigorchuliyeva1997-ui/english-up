
function isValidEmail(value) {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

function isValidPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= 8 &&
    value.length <= 128
  );
}

function isValidName(value) {
  return (
    typeof value === "string" &&
    value.trim().length >= 2 &&
    value.trim().length <= 100
  );
}

function isValidId(value) {
  return (
    (typeof value === "string" || typeof value === "number") &&
    /^\d+$/.test(String(value)) &&
    Number(value) > 0
  );
}

function isValidText(value, minLength = 1, maxLength = 5000) {
  return (
    typeof value === "string" &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength
  );
}

function isValidEnum(value, allowedValues) {
  return (
    Array.isArray(allowedValues) &&
    allowedValues.includes(value)
  );
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidId,
  isValidText,
  isValidEnum
};
