const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

// 1) MIDDLEWARE DECLARATION
app.use(morgan('dev'));

// applying MIDDLEWARES for puting the data send from the client to be inside the req.body
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();

  next();
});

// 3) using the imported routers as MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
