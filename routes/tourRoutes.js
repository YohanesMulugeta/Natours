const express = require('express');

const tourController = require('../controllers/tourController');

// 1) CREATING ROUTER
const router = express.Router();

// router.param('id', checkId);
// 2)  HANDLING ROUTES

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router.route('/tour-stats').get(tourController.tourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
