/* eslint-disable prefer-arrow-callback */
// 1) USERS ROUTES HANDLERS
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(500).json({
    status: 'Error',
    data: { users },
  });
});

exports.updateMe = catchAsync(async function (req, res, next) {
  // 1) send error if user is trying to update passwrod data
  const data = req.body;
  if (data.password || data.passwordConfirm)
    return next(
      new AppError(
        'This route is not password update. please use /updateMyPassword route.',
        400
      )
    );

  // 2) prevent a user updating a role
  if (data.role)
    return next(new AppError('You are not allowed to update role field', 400));

  // 3) update user and also run validators
  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user,
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
