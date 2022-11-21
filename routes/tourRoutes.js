const express = require('express');

const {
  getAllTours,
  createNewTour,
  getTourById,
  updateTour,
  deleteTour,
  // checkBody,
} = require('../controllers/tourController');

// 1) CREATING ROUTER
const router = express.Router();

// router.param('id', checkId);
// 2)  HANDLING ROUTES
router.route('/').get(getAllTours).post(createNewTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
