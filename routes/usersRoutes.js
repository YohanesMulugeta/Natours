const express = require('express');
const usersController = require('../controllers/usersController');

const authController = require('../controllers/authController');

// 1) CREATING THE ROUTER
const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);

// 1) HANDLING ROUTES
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

//   2) ROUTE HANDLERS

module.exports = router;
