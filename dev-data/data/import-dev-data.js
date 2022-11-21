const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  clearDatabase,
  importDataToDatabase,
} = require('../../controllers/tourController');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// This is about the server connection to the database therefor
// we will use this code inside this file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
(async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('Database connection is successful!');

  if (process.argv[2] === '--import') {
    importDataToDatabase(tours);
  } else if (process.argv[2] === '--delete') {
    clearDatabase();
  }
})();

// DELETE DATABASE
