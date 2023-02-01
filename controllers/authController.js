const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  // 1) recieve onlly the fields we want to store to our user document
  const { name, email, password, passwordConfirm } = req.body;

  // 2) create user
  const newUser = await User.create({ name, email, password, passwordConfirm });

  // 3) signIn user
  const token = sign(newUser._id);

  // 3) send response with the token
  res.status(201).json({
    message: 'success',
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  // 1) check if there is password
  if (!email || !password)
    return next(
      new AppError('Both email and password fields are required for loging in.')
    );

  // 2) check if a user exists with the email provided
  const user = await User.findOne({ email });

  // 3) verify the password
  const isCorrect = await user?.isCorrect(password);

  if (!user || !isCorrect)
    return next(new AppError('Invalid eamil or password.', 403));

  // 4) login
  const token = sign(user.id);

  // 5) send responce
  res.status(200).json({ status: 'success', token });
});
