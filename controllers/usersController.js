/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-arrow-callback */
// 1) USERS ROUTES HANDLERS
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { promisify } = require('util');

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

// ---------------MULTER RELATED
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     // user-userId-currentTimeStamp
//     const extension = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${extension}`);
//   },
// });

// best used for precessing images
const multerStorage = multer.memoryStorage();
// the buffer is find inside req.file.buffer

const multerFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image');
  const error = isImage
    ? null
    : new AppError('Not Image! Please upload only image.', 400);

  cb(error, isImage);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Image UPLOAD
exports.uploadUserPhoto = upload.single('photo');

// ------------------- RESIZE-PHOTO
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500, {
      fit: 'cover',
      position: 'left top',
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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

  if (req.file) filteredData.photo = req.file.filename;

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
