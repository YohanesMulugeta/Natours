const express = require('express');
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const authController = require('../controllers/authController');

// 1) CREATING THE ROUTER
const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// 1) HANDLING ROUTES
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

//   2) ROUTE HANDLERS

module.exports = router;
