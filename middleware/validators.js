const HttpError = require('../utils/HttpError');

// Checks that a URL parameter is a positive whole number, e.g. /movies/3.
// The number is saved on req.ids so the controller doesn't parse it again.
function checkId(param, label) {
  return (req, res, next) => {
    const value = Number(req.params[param]);
    if (!Number.isInteger(value) || value < 1) {
      return next(new HttpError(400, `${label} id must be a positive whole number`));
    }
    req.ids = { ...req.ids, [param]: value };
    next();
  };
}

// ?search= and ?genre= are optional, but must be one short piece of text
function checkMovieQuery(req, res, next) {
  for (const key of ['search', 'genre']) {
    const value = req.query[key];
    if (value === undefined) continue;
    if (typeof value !== 'string' || value.trim().length > 100) {
      return next(new HttpError(400, `${key} must be a text of at most 100 characters`));
    }
  }
  next();
}

module.exports = { checkId, checkMovieQuery };
