/* eslint-disable prefer-object-spread */
/* eslint-disable node/no-unsupported-features/es-syntax */

const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = async function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,ratingsAverage,price,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // 2) EXCUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();

  const tours = await features.mongooseQueryObject; // await will cause teh query object to be excuted

  // 3) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getTourById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);
  // Tour.findOne({ _id: id })

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.createNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'succes',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = async function (req, res) {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ); // this sets the returned value will be the new one
    res.status(200).json({
      status: 'success',
      data: { tour: updatedTour },
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: 'Fail', message: err.message });
  }
};

exports.deleteTour = async function (req, res) {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: err });
  }
};

exports.tourStats = async function (req, res) {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numOfTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'EASY' } } },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: { stats },
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: 'Fail', message: err.message });
  }
};

exports.getMonthlyPlan = async function (req, res) {
  try {
    const year = +req.params.year; // eg: 2021

    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      { $project: { _id: 0 } },
      { $sort: { numOfTourStarts: -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: 'success',
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: 'Fail', message: err.message });
  }
};

exports.importDataToDatabase = async function (tours) {
  try {
    await Tour.create(tours);

    // eslint-disable-next-line no-console
    console.log(
      'Tours are exported to mongodb database successfully'
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  process.exit();
};

exports.clearDatabase = async function () {
  try {
    await Tour.deleteMany();
    // eslint-disable-next-line no-console
    console.log('DataBase is cleared');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  process.exit();
};
