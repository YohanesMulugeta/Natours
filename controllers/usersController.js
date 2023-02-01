// 1) USERS ROUTES HANDLERS
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(500).json({
    status: 'Error',
    data: { users },
  });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
};
exports.getUserById = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = catchAsync(async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { deleted },
  });
});
