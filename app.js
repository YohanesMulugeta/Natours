const express = require('express');
const fs = require('fs');
const app = express();

// applying MIDDLEWARES
app.use(express.json());

// Top level READING
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// the ROUTE HANDLERS is the callback fun that handle the req
function getAllTours(req, res) {
  res.status(200).json({
    status: 'success',
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

// ROUTS

// // -------------------------- GET TOUR WITH ID
// app.get('/api/v1/tours/:id', getTourById);
// // -------------------------- CREATE TOUR
// app.post('/api/v1/tours', createNewTour);
// // ---------------------------- UPDATE TOUR
// app.patch('/api/v1/tours/:id', updateTour);
// // ---------------------------- DELETE TOUR
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
