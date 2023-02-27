const express = require('express');
const multer = require('multer');

const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

// 1) CREATING THE ROUTER
const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

// PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', usersController.getMe, usersController.getUser);
router.patch(
  '/updateMe',
  usersController.uploadUserPhoto,
  usersController.updateMe
);
router.delete('/deleteMe', usersController.deleteMe);

// STRICT ALL ROUTES after this to ADMIN
router.use(authController.strict('admin'));

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

//   2) ROUTE HANDLERS

module.exports = router;
