// Express 4 does not catch errors thrown inside async functions.
// This wrapper passes a failed promise on to next(), so the error handler
// receives it and the controllers don't need try/catch everywhere.
function asyncHandler(controller) {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
