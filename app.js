const app = require('express')();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', authod: 'Yohanes' });
});

app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
