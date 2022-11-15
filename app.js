const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();
// 1) MIDDLEWARES

app.use(morgan('dev'));

// applying MIDDLEWARES
app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();

  next();
});

// 3) using the imported routers as MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

// 5) STARTING OUR SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
