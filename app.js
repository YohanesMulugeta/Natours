const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

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

// 2) TOP LEVEL READING
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// 3) the ROUTE HANDLERS is the callback fun that handle the req
function getAllTours(req, res) {
  res.status(200).json({
    status: 'success',
    requestTime: req.reqTime,
    results: tours.length,
    data: { tours },
  });
}

function getTourById(req, res) {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  console.log(tours.length);
  // if (id >= tours.length)
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: `Invalid id ${id}`,
    });

  res.status(200).json({ status: 'success', data: { tour } });
}

function createNewTour(req, res) {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // the status code 201 is for data is created
      res.status(201).json({ stasus: 'success', data: { tour: newTour } });
    }
  );
}

function updateTour(req, res) {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  // GUARD KEY
  if (!tour)
    return res
      .status(404)
      .json({ status: 'fail', message: `Invalid id ${id}` });

  const newTour = { ...tour, ...req.body };

  res.status(201).json({
    status: 'success',
    results: 2,
    data: {
      tour,
      newTour,
    },
  });
}

function deleteTour(req, res) {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  if (!tour) return res.status(404).send('Could not find the tour');

  const newTour = tours.filter((el) => el.id !== id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
}

function getAllUsers(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}

function createUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function getUserById(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function updateUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function deleteUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}

// 4) ROUTS with individual http methods

// // -------------------------- GET TOUR WITH ID
// app.get('/api/v1/tours/:id', getTourById);
// // -------------------------- CREATE TOUR
// app.post('/api/v1/tours', createNewTour);
// // ---------------------------- UPDATE TOUR
// app.patch('/api/v1/tours/:id', updateTour);
// // ---------------------------- DELETE TOUR
// app.delete('/api/v1/tours/:id', deleteTour);

// 4) ROUTS WITH CHAINING HTTP METHODS
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/appi/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

// 5) STARTING OUR SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
