const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  //   this.populate({ path: 'tour', select: 'name' }).populate({
  //     path: 'author',
  //     select: 'name photo',
  //   });
  next();
});

reviewSchema.post('save', function () {
  // this.constructor points to the class of the object
  this.constructor.calcRatingStats(this.tour);
});

reviewSchema.pre(/findOneAnd/, async function (next) {
  // passing data from pre middleware to post middlewares
  this.review = await this.findOne();

  next();
});

reviewSchema.post(/findOneAnd/, async function (doc) {
  await this.review.constructor.calcRatingStats(this.review.tour);
});

// The 'this' keyword on statics method points to the class itself
reviewSchema.statics.calcRatingStats = async function (tourId) {
  try {
    const stats = await this.aggregate([
      {
        $match: { tour: tourId },
      },
      {
        $group: {
          _id: '$tour',
          nRatings: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0]?.nRatings || 0,
      ratingsAverage: stats[0]?.averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
