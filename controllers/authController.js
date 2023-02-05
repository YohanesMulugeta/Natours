const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const AppError = require('../utils/appError');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../utils/sendEmail');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

const signAndSendToken = (user, statusCode, res) => {
  const token = sign(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // 1) recieve onlly the fields we want to store to our user document
  const { name, email, password, passwordConfirm } = req.body;

  // 2) create user
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  signAndSendToken(newUser, 201, res);
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

  signAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check if the header starts with bearer
  const { authorization } = req.headers;
  const token =
    authorization?.startsWith('Bearer') && authorization.split(' ')[1];

  if (!token)
    return next(
      new AppError('You are not loged in. please login and try again.', 401)
    );

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 1) check if the user still exists
  const user = await User.findById(id);
  if (!user)
    return next(
      new AppError('NO user exists with this token. Please login again.', 401)
    );

  // 2) check if the password is not changed after token issue
  if (user.isPasswordChangedAfter(iat * 1000))
    return next(
      new AppError(
        'Password has changed recently. Please login and try again.',
        401
      )
    );

  // Passing the user to the next middleware
  req.user = user;

  next();
});

exports.strict = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async function (req, res, next) {
  // 1) RECIEVE EMAIL AND CHECK IF THERE IS EMAIL
  const { email } = req.body;

  if (!email)
    return next(
      new AppError('Please provide email address to update your password.', 400)
    );

  // 2) FIND THE USER WITH THE PROVIDED EMAIL ADDRESS
  const user = await User.findOne({ email });

  if (!user) return next(new AppError('No user with this email address.', 400));

  const resetToken = await user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const passwordResetLink = `Forgot your password? Submit a patch request with your new password and password confirm to:${req.baseUrl}/resetPassword/${resetToken} \nAnd if you dont forget your password please ignore this message`;
  const subject = `Your password reset link. (Valid for 10 minutes)`;

  await sendMail('yohanesMulugeta21@gmail.com', subject, passwordResetLink);

  res.status(200).json({
    status: 'success',
    message: 'password reset link has been sent to your email address',
  });
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  // 1) recieve the reset token, newPassword, confirmPassword
  const { resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  // 2) encrypt and find the user with this resetToken
  const encryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user)
    return next(new AppError('Reset link is invalid or has expired.', 400));

  // 3) resetPassword
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  signAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async function (req, res, next) {
  const { password, newPassword, passwordConfirm } = req.body;

  // 1) check if both the fields are here
  if (!password || !passwordConfirm || !newPassword)
    return next(
      new AppError(
        'Password, newPassword, and passwordConfirm are required.',
        401
      )
    );

  // 2) check if the user entered a correct password
  if (!(await req.user.isCorrect(password)))
    return next(new AppError('Incorrect password.', 401));

  // 2) set the password to the new one
  req.user.password = newPassword;
  req.user.passwordConfirm = passwordConfirm;

  await req.user.save();

  signAndSendToken(req.user, 200, res);
});
