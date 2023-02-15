process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SERVER SHUTTING DOWN');
  console.log(err);

  process.exit(1);
});

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

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('ERROR UNHANDLED REJECTION!  SHUTTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
