// An error that already knows which HTTP status it should become.
// Controllers throw it, and middleware/errorHandler.js turns it into JSON.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
