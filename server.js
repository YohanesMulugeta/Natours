const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

(async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log('Database connection is successful!');
})();

// Modle is like a blue print to create documents
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a price'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'Forest Hiker',
  price: '497',
});

(async () => {
  try {
    const doc = await testTour.save();

    console.log(doc);
  } catch (err) {
    console.log('ERROR', err);
  }
})();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runing at port ${port}...`);
});
