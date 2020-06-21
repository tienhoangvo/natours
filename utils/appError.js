class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// All the errors that we will create using this class will all be operational errors
// Errors that we can predict what will happen at some point in the future.
// => OPERATIONAL ERRORS

// this.isOperational => we can then test for this property and only send error messages back to the client for these operational errors
// because some other crazy unexpected errors that might happen in our application, for example: a programming error, or some bug in one of
// the packages that we require into our app.
// And these errors will not have this.isOperational property on them
