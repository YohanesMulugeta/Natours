const express = require('express');
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

// 1) CREATING THE ROUTER
const router = express.Router();

// 1) HANDLING ROUTES
router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

//   2) ROUTE HANDLERS

module.exports = router;
