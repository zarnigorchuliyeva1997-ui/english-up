
function notFound(req, res, next) {
  const error = new Error(
    `API manzili topilmadi: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
}

module.exports = notFound;
