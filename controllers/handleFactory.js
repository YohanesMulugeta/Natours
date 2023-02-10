/* eslint-disable prefer-arrow-callback */
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.createOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async function (req, res, next) {
    const query = Model.findById(req.params.id);

    if (populateOptions) query.populate(populateOptions);

    const doc = await query;

    if (!doc)
      return next(
        new AppError(`No document with the Id: ${req.params.id}.`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async function (req, res, next) {
    // To allow for nested route reviews on a tour
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .project()
      .paginate();

    const docs = await features.mongooseQueryObject;

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });
