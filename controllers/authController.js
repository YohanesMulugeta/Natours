const jwt = require('jsonwebtoken');

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
