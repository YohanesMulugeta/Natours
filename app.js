const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

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

// DATA SANITIZATION against NOSQL query injections
app.use(mongoSanitize());

// DATA SANITIZATION against XSS
app.use(xss());

// prevent PARAMETER POLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'price',
      'ratingsAverage',
      'maxGroupSize',
    ],
  })
);

// TEST middleware
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();

  next();
});

// rOUTERS
app.get('/', (req, res, next) => {
  res.status(200).render('base', { tour: 'The Forest Hiker', user: 'Yohanes' });
});

app.get('/overview', (req, res, next) => {
  res.status(200).render('overview', { title: 'All Tours' });
});

app.get('/tour', (req, res, next) => {
  res.status(200).render('tour', { title: 'The Sea Explorer' });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
