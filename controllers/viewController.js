const Tour = require('../model/tourModel');

exports.getOverview = (req, res, next) => {
  // 1) get All the tour deta from our collection

  //   2) build template

  //   3) Render the template using the tour data from 1)
  res.status(200).render('overview', { title: 'All Tours' });
};

exports.getTourDetail = (req, res, next) => {
  res.status(200).render('tour', { title: 'The Sea Explorer' });
};
