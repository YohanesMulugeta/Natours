/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-arrow-callback */
const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');
const Tour = require('../model/tourModel');

exports.getAllReviews = catchAsync(async function (req, res, next) {
  const query = Review.find();
  if (req.params.tourId) query.find({ tour: req.params.tourId });

  const reviews = await query.exec();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.setTourAndUserId = catchAsync(async function (req, res, next) {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user._id;

  const tour = await Tour.findById(req.body.tour);

  if (!tour)
    return next(
      new AppError('No tour with this ID. A review must belong to a Tour.', 400)
    );

  next();
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.delete = factory.deleteOne(Review);

// exports.delete = catchAsync(async function (req, res, next) {
//   const { id } = req.params;

//   const review = await Review.findByIdAndDelete(id);

//   if (!review)
//     return next(new AppError('No review with the provided id.', 400));

//   res.status(204).json({
//     status: 'success',
//   });
// });
