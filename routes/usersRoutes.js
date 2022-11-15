const express = require('express');

const router = express.Router();

// 1) ROUTES
router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

//   2) ROUTE HANDLERS
function getAllUsers(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}

function createUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function getUserById(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function updateUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}
function deleteUser(req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
}

module.exports = router;
