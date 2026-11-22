
function successResponse(
  res,
  data = null,
  message = "So'rov muvaffaqiyatli bajarildi.",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function errorResponse(
  res,
  message = "So'rovni bajarishda xatolik yuz berdi.",
  statusCode = 400,
  errors = null
) {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse
};
