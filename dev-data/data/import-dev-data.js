const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../model/tourModel');
const Review = require('../../model/reviewModel');
const User = require('../../model/userModel');

dotenv.config({ path: './config.env' });

// const {
//   clearDatabase,
//   importDataToDatabase,
// } = require('../../controllers/tourController');

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

  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
  const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
  );
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

  async function importData() {
    try {
      await Tour.create(tours);
      await Review.create(reviews);
      await User.create(users, { validateBeforeSave: false });

      console.log('Database Populated Successfully.');
    } catch (err) {
      console.log(err);
    }
  }

  async function clearDatabase() {
    try {
      await Tour.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();

      console.log('database cleared successfully');
    } catch (err) {
      console.log(err);
    }
  }

  if (process.argv[2] === '--import') importData();
  else if (process.argv[2] === '--delete') clearDatabase();
})();

// DELETE DATABASE
