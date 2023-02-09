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
    reviewController.createReview
  );

router.route('/:id').delete(reviewController.delete);

module.exports = router;

// {"email":"cookieTest@gmail.com","password":"mamasHome"}
