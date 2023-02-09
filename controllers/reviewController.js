/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-arrow-callback */
const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.createReview = catchAsync(async function (req, res, next) {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user._id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review,
  });
});

exports.delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review)
    return next(new AppError('No review with the provided id.', 400));

  res.status(204).json({
    status: 'success',
  });
});
