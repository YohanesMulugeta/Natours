const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewController.me);

router.use(authController.isLogedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTourDetail);
router.get('/login', viewController.getLogin);

module.exports = router;
