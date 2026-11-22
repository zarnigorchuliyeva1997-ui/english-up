
function getPagination(query = {}) {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0
    ? Math.min(parsedPage, 1000000)
    : 1;

  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, 100)
    : 20;

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset
  };
}

function getPaginationMeta(totalItems, page, limit) {
  const total = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.ceil(total / limit);

  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    perPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

module.exports = {
  getPagination,
  getPaginationMeta
};
