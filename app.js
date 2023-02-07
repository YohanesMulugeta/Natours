const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARE DECLARATION
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// set SECURITY HTTP headers
app.use(helmet());

// Limit REQUESTS from the same IIP
const limiter = rateLimit({
  max: 30,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// TEST middleware
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();

  next();
});

// rOUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
