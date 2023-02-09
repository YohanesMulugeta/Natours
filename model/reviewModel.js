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
      unique: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo',
  });
  //   this.populate({ path: 'tour', select: 'name' }).populate({
  //     path: 'author',
  //     select: 'name photo',
  //   });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
