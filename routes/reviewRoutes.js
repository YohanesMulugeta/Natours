const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.strict('user'),
    reviewController.setTourAndUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authController.strict('admin'), reviewController.delete)
  .patch(authController.strict('user', 'admin'), reviewController.updateReview);

module.exports = router;

// {"email":"cookieTest@gmail.com","password":"mamasHome"}
