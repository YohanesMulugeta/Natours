/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-object-spread */
/* eslint-disable node/no-unsupported-features/es-syntax */
const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../model/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// --------------------- IMAGE-UPLOAD
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
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// ----------------- IMAGE-PROCESSESING
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  // 1) Cover-Image
  function processImage(buffer, imgName) {
    return sharp(buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${imgName}`);
  }

  if (req.files.imageCover) {
    const imageConverFileName = `tour-${
      req.params.id
    }-${Date.now()}-cover.jpeg`;

    await processImage(req.files.imageCover[0].buffer, imageConverFileName);

    req.body.imageCover = imageConverFileName;
  }

  if (req.files.images) {
    const images = [];

    await Promise.all(
      req.files.images.map((img, i) => {
        const imgName = `tour-${req.id}-${Date.now()}-${i + 1}.jpeg`;
        images.push(imgName);

        return processImage(img.buffer, imgName);
      })
    );

    req.body.images = [...images];
  }

  next();
});

// SINGLE=> upload.single('feildName')
// many from ONE FIELD=> upload.array('feildName',MAX_COUNT)

exports.aliasTopTours = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, { path: 'reviews', select: '-__v' });
exports.createNewTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.tourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});

// exports.importDataToDatabase = async function (Model, data) {
//   try {
//     await Model.create(data);

//     // eslint-disable-next-line no-console
//     console.log('Datas are exported to mongodb database successfully');
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//   }
//   process.exit();
// };

// exports.clearDatabase = async function (Model) {
//   try {
//     await Model.deleteMany();
//     // eslint-disable-next-line no-console
//     console.log('DataBase is cleared');
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//   }
//   process.exit();
// };
