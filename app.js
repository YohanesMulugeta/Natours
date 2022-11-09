const app = require('express')();
const fs = require('fs');

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

// the ROUTE handler is the call back fun that handle the req
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
