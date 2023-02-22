/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utils/appError');

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFields(err) {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value} please use another value`;
  return new AppError(message, 400);
}

function handleValidationError(err) {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  return new AppError(message, 400);
}

function handleJasonWebTokenError() {
  return new AppError('Invalid token. Please login and try again.', 401);
}

function handleExpiredToken() {
  return new AppError('You are no longer loged in. Please login again', 401);
}

function sendErrorDev(err, req, res) {
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong!', msg: err.message });
}

function sendErrorPro(err, req, res) {
  // A) API
  // Trusted operational errors
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log('ERROR', err);
    // 2) send generic responses
    return res.status(500).json({
      status: 'fail',
      message: 'Something went out very wrong, please try again',
    });
  }

  // B) RENDERED
  if (err.isOperational)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      msg: err.message,
    });

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong.',
    msg: 'Please try again',
  });
}

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  let error = { ...err, message: err.message };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
  // console.log(err.name);
  if (err.code === 11000) error = handleDuplicateFields(err);
  if (err.name === 'CastError') error = handleCastErrorDB(error);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJasonWebTokenError();
  if (err.name === 'TokenExpiredError') error = handleExpiredToken();
  if (process.env.NODE_ENV === 'production') {
    sendErrorPro(error, req, res);
  }
};
