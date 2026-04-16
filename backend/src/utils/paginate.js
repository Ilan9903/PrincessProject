/**
 * Pagine un tableau et retourne le format standardisé.
 * @param {Array} items - Tableau complet (déjà filtré)
 * @param {object} query - req.query avec page et limit
 * @returns {{ data: Array, pagination: { page, limit, total, totalPages } }}
 */
export function paginate(items, query = {}) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(query.limit) || 20), 100);
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, pagination: { page, limit, total, totalPages } };
}
