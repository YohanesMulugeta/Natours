const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  // 1) recieve onlly the fields we want to store to our user document
  const { name, email, password, passwordConfirm } = req.body;

  // 2) create user
  const newUser = await User.create({ name, email, password, passwordConfirm });

  // 3) send response
  res.status(201).json({
    message: 'success',
    data: { newUser },
  });
});
