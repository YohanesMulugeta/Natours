const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// 1) CREATING ROUTER
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.strict('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router.route('/tour-stats').get(tourController.tourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.strict('admin', 'lead-guide'),
    tourController.createNewTour
  );

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(
    authController.protect,
    authController.strict('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.strict('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
