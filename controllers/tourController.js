/* eslint-disable prefer-object-spread */
/* eslint-disable node/no-unsupported-features/es-syntax */

const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = async function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,ratingsAverage,price,summary,difficulty';

  next();
};

exports.getAllTours = async function (req, res) {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourById = async function (req, res) {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);
    // Tour.findOne({ _id: id })

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.createNewTour = async function (req, res) {
  try {
    // const newTour = new Tour()
    // newTour.save()

    // This creates the tour object and saves it on the MONGODB
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'succes',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.updateTour = async function (req, res) {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: false,
      }
    ); // this sets the returned value will be the new one
    res.status(200).json({
      status: 'success',
      data: { tour: updatedTour },
    });
  } catch (err) {
    res.status(404).json({ status: 'Fail' });
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

exports.importDataToDatabase = async function (tours) {
  try {
    await Tour.create(tours);

    console.log(
      'Tours are exported to mongodb database successfully'
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

exports.clearDatabase = async function () {
  try {
    await Tour.deleteMany();

    console.log('DataBase is cleared');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
