const mongoose = require('mongoose');

// Modle is like a blue print to create documents
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a price'],
    unique: [true, 'Duplicate tour name'],
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

module.exports = mongoose.model('Tour', tourSchema);
