/* eslint-disable prefer-arrow-callback */
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError('No document with this ID.', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// exports.createDocument = (Model) => catchAsync(function (req, res, next) {});

exports.updateOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!doc) return next(new AppError('No document with this ID.', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
