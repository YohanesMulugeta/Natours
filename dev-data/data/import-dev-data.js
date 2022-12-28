const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const {
  clearDatabase,
  importDataToDatabase,
} = require('../../controllers/tourController');

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
  // eslint-disable-next-line no-console
  console.log('Database connection is successful!');

  if (process.argv[2] === '--import') {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    );

    importDataToDatabase(tours);
  } else if (process.argv[2] === '--delete') {
    clearDatabase();
  }
})();

// DELETE DATABASE
