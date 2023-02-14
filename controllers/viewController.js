const catchAsync = require('../utils/catchAsync');
const Tour = require('../model/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get All the tour deta from our collection
  const tours = await Tour.find();

  //   2) build template

  //   3) Render the template using the tour data from 1)
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTourDetail = (req, res, next) => {
  res.status(200).render('tour', { title: 'The Sea Explorer' });
};
