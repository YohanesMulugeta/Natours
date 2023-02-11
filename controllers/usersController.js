/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-arrow-callback */
// 1) USERS ROUTES HANDLERS
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

const filterObj = (obj, ...fields) => {
  fields.forEach((field) => {
    delete obj[field];
  });

  return { ...obj };
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

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

  // 2) filter the data obj so that a user will not update unwanted fields

  const filteredData = filterObj(
    data,
    'role',
    'passwordResetExpires',
    'passwordResetToken',
    'passwordChangedAt'
  );

  // 3) update user and also run validators
  const user = await User.findByIdAndUpdate(req.user._id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!. Please use /signUp instead.',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
