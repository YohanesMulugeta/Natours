const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// This is about the server connection to the database therefor
// we will use this code inside this file
(async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log('Database connection is successful!');
})();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
