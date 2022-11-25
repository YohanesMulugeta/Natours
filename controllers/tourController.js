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
exports.aliasTopTours = async function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,ratingsAverage,price,summary,difficulty';

  next();
};

exports.getAllTours = async function (req, res) {
  try {
    //  1) FILTERING the query object to eliminate limit, sort, page and .. requests
    const queryObj = { ...req.query };
    const toBeEliminatedQueries = [
      'sort',
      'page',
      'limit',
      'fields',
    ];
    toBeEliminatedQueries.forEach((el) => {
      delete queryObj[el];
    });

    // 2) BUILD UP query obj
    // A) Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte)|(lt)|(lte)|(gt)\b/g,
      (str) => `$${str}`
    );

    // CREATING QUERY OBJECT
    let query = Tour.find(JSON.parse(queryStr));

    // B) SORTING
    if (req.query.sort)
      query = query.sort(req.query.sort.split(',').join(' '));
    else query = query.sort('-createdAt');

    // C) LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // C) PAGINATION
    const limit = +req.query.limit || 5;
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours)
        throw new Error('This page does not exist');
    }

    // 2) EXCUTE QUERY
    const tours = await query; // await will cause teh query object to be excuted

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
