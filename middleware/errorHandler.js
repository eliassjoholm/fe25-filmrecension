const HttpError = require('../utils/HttpError');

// Runs when no route matched the request
function notFound(req, res, next) {
  next(new HttpError(404, `No route for ${req.method} ${req.originalUrl}`));
}

// Express knows this is the error handler because it takes four arguments.
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'The request body is not valid JSON' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    // Safety net for the UNIQUE constraints, e.g. two identical requests at once
    return res.status(409).json({ error: 'That already exists' });
  }
  // Anything else is a bug or a database problem. Log the details for us,
  // but only send a general message so no SQL or secrets reach the client.
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
