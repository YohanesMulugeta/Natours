const express = require('express');
const fs = require('fs');
const app = express();

// applying MIDDLEWARES
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', authod: 'Yohanes' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can post to this endpoint...');
// });

// Top level READING
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// the ROUTE handler is the callback fun that handle the req

// --------------------------- GET ALL TOURS
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// -------------------------- GET TOUR WITH ID
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// -------------------------- CREATE TOUR
app.post('/api/v1/tours', (req, res) => {
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
});

// ---------------------------- UPDATE TOUR
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
