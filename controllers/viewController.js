const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../model/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get All the tour deta from our collection
  const tours = await Tour.find();

  //   2) build template

  //   3) Render the template using the tour data from 1)
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTourDetail = catchAsync(async (req, res, next) => {
  // 1) GET THE TOUR including
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour)
    return next(
      new AppError(
        `There is no tour with name "${slug.split('-').join(' ')}"`,
        404
      )
    );
  //   2)BUILD THE TEMPLATE

  //   3)RENDER THE TEMPLATE USING THE TOURdATA FROM 1

  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

exports.getLogin = (req, res, next) => {
  // 1) build the template

  // 2) render the template
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.me = catchAsync(async (req, res, next) => {
  res.status(200).render('account', { title: 'Your Account' });
});
