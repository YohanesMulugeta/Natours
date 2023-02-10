const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.strict('user'),
    reviewController.setTourAndUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.delete)
  .patch(
    authController.protect,
    authController.strict('user'),
    reviewController.setTourAndUserId,
    reviewController.updateReview
  );

module.exports = router;

// {"email":"cookieTest@gmail.com","password":"mamasHome"}
