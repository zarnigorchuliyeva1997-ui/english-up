
function isValidDate(value) {
  const date = new Date(value);

  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !Number.isNaN(date.getTime())
  );
}

function formatDate(value) {
  if (!isValidDate(value)) {
    throw new Error("Noto'g'ri sana.");
  }

  return new Date(value).toISOString();
}

function addDays(value, days) {
  if (!isValidDate(value)) {
    throw new Error("Boshlang'ich sana noto'g'ri.");
  }

  if (!Number.isInteger(days)) {
    throw new Error("Kunlar soni butun son bo'lishi kerak.");
  }

  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);

  return date;
}

function daysBetween(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error("Sana qiymati noto'g'ri.");
  }

  const start = Date.parse(startDate);
  const end = Date.parse(endDate);
  const oneDay = 24 * 60 * 60 * 1000;

  return Math.ceil((end - start) / oneDay);
}

function isExpired(value) {
  if (!isValidDate(value)) {
    throw new Error("Tugash sanasi noto'g'ri.");
  }

  return new Date(value).getTime() <= Date.now();
}

module.exports = {
  isValidDate,
  formatDate,
  addDays,
  daysBetween,
  isExpired
};
