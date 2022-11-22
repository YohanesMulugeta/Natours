/* eslint-disable prefer-object-spread */
/* eslint-disable node/no-unsupported-features/es-syntax */

const Tour = require('../model/tourModel');

// 1) TOP LEVEL READING
// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// );

// 2) TOURS ROUTES HANDLERS
// exports.checkId = function (req, res, next, id) {
// if (id >= tours.length)
//   return res
//     .status(404)
//     .json({ status: 'Fail', message: 'Invalid ID' });

// next();
// };

// exports.checkBody = function (req, res, next) {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'Fail',
//       message: 'Missing name or price',
//     });
//   }

//   next();
// };
exports.getAllTours = async function (req, res) {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (str) => `$${str}`
    );

    // replace gt,gte,lt,lte with $gt, $gte, $lt, $lte
    // 1) BUILD QUERY
    const query = Tour.find(JSON.parse(queryStr));

    // 2) EXCUTE QUERY
    const tours = await query;

    // 3) SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
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
