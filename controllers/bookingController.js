/* eslint-disable camelcase */
/* eslint-disable prefer-arrow-callback */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async function (req, res, next) {
  // 1) get the currunt booked tour
  const { tourID } = req.params;
  const tour = await Tour.findById(tourID);

  if (!tour) return next(new AppError('No tour with this Id', 404));

  //   2) create checkout session
  const product_data = { name: tour.name, description: tour.summary };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: tourID,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data,
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create sessin as a response
  res.status(200).json({ status: 'success', session });
});
