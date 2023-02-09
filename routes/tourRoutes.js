const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// 1) CREATING ROUTER
const router = express.Router();

// router.param('id', checkId);
// 2)  HANDLING ROUTES

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.strict('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-stats').get(tourController.tourStats);

router
  .route('/')
  .get(
    authController.protect,

    tourController.getAllTours
  )
  .post(authController.protect, tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.strict('admin', 'lead-guide', 'guide'),
    tourController.deleteTour
  );

module.exports = router;
