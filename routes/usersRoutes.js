const express = require('express');
const usersController = require('../controllers/usersController');

const authController = require('../controllers/authController');

// 1) CREATING THE ROUTER
const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get(
  '/me',
  authController.protect,
  usersController.getMe,
  usersController.getUser
);
router.patch('/updateMe', authController.protect, usersController.updateMe);
router.delete('/deleteMe', authController.protect, usersController.deleteMe);

// 1) HANDLING ROUTES
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.strict('admin'),
    usersController.getUser
  )
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

//   2) ROUTE HANDLERS

module.exports = router;
