const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empity'],
    },
    rating: {
      type: Number,
      max: [5, 'Tours rating must be below 5'],
      min: [1, 'Tours rating must not be less that 0'],
      requried: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour.'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;