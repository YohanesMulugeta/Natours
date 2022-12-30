function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorPro(err, res) {
  // Trusted operational errors
  if (err.isOperatiional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // UNKOWN errors so that we dont want to send errors to the client

    // 1) log the error
    console.error('ERROR', err);

    // 2) send generic responses
    res.status(500).json({
      status: 'fail',
      message: 'Something went out bery wrong, please try again',
    });
  }
}

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    sendErrorPro(err, res);
  }
};
