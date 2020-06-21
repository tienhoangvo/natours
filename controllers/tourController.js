const multer = require('multer');
const sharp = require('sharp');

const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {
 getAll,
 getOne,
 createOne,
 deleteOne,
 updateOne,
} = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
 if (file.mimetype.startsWith('image'))
  return cb(null, true);
 cb(
  new AppError(
   'Not an image! Please upload only images',
   400
  ),
  false
 );
};

const upload = multer({
 storage: multerStorage,
 fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
 { name: 'imageCover', maxCount: 1 },
 { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(
 async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images)
   return next();
  const { imageCover, images } = req.files;

  // 1) Cover image
  const imageCoverFilename = `tour-${
   req.params.id
  }-${Date.now()}-cover.jpeg`;
  await sharp(imageCover[0].buffer)
   .resize(2000, 1333)
   .toFormat('jpeg')
   .jpeg({ quality: 90 })
   .toFile(
    `public/img/tours/${imageCoverFilename}`
   );
  req.body.imageCover = imageCoverFilename;

  // 2) images;
  req.body.images = [];
  await Promise.all(
   images.map(async (image, key) => {
    const imageFilename = `tour-${
     req.params.id
    }-${Date.now()}-${key + 1}.jpeg`;

    await sharp(image.buffer)
     .resize(2000, 1333)
     .toFormat('jpeg')
     .jpeg({ quality: 90 })
     .toFile(`public/img/tours/${imageFilename}`);

    req.body.images.push(imageFilename);
   })
  );

  console.log(req.body);
  next();
 }
);

exports.aliasTopTours = (req, res, next) => {
 req.query = {
  limit: 5,
  sort: '-ratingsAverage,price',
  fields:
   'name,price,ratingsAverage,summary,difficulty',
 };

 next();
};

exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, {
 path: 'reviews',
});

exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getTourStats = catchAsync(
 async (req, res, next) => {
  const stats = await Tour.aggregate([
   {
    $match: { ratingsAverage: { $gte: 4.5 } },
   },
   {
    $group: {
     _id: { $toUpper: '$difficulty' },
     num: { $sum: 1 },
     numRatings: {
      $sum: '$ratingsQuantity',
     },
     avgRating: { $avg: '$ratingsAverage' },
     avgPrie: { $avg: '$price' },
     minPrice: { $min: '$price' },
     maxPrice: { $max: '$price' },
    },
   },
   {
    $sort: { avgPrice: 1 },
   },
   // {
   //   $match: { _id: { $ne: 'EASY' } },
   // },
  ]);

  res.status(200).json({
   status: 'success',
   data: {
    stats,
   },
  });
 }
);

exports.getMonthlyPlan = catchAsync(
 async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
   {
    $unwind: '$startDates',
   },
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
     numTourStarts: { $sum: 1 },
     tours: { $push: '$name' },
    },
   },
   {
    $addFields: {
     month: '$_id',
    },
   },
   {
    $project: {
     _id: 0,
    },
   },
   {
    $sort: {
     numberTourStarts: -1,
    },
   },
   {
    $limit: 6,
   },
  ]);

  res.status(200).json({
   status: 'success',
   data: {
    plan,
   },
  });
 }
);

//   '/tours-within/:distance/center/:latlng/unit/:unit'
// /tours-within/2344/center/34.111745, -118.113491/unit/mi
exports.getToursWithin = catchAsync(
 async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius =
   unit === 'mi'
    ? distance / 3963.1
    : distance / 6378.1;
  if (!lat || !lng)
   return next(
    new AppError(
     'Please provide latitude and longtitude in the format lat,lng.',
     400
    )
   );
  console.log(radius);
  const tours = await Tour.find({
   startLocation: {
    $geoWithin: {
     $centerSphere: [[lng, lat], radius],
    },
   },
  });

  console.log(distance, lat, lng, unit);
  res.status(200).json({
   status: 'success',
   results: tours.length,
   data: {
    data: tours,
   },
  });
 }
);

exports.getDistances = catchAsync(
 async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier =
   unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng)
   return next(
    new AppError(
     'Please provide latitude and longtitude in the format lat,lng.',
     400
    )
   );

  console.log(req.params);

  const distances = await Tour.aggregate([
   {
    $geoNear: {
     near: {
      type: 'Point',
      coordinates: [lng * 1, lat * 1],
     },
     distanceField: 'distance',
     distanceMultiplier: multiplier,
    },
   },
   {
    $project: {
     distance: 1,
     name: 1,
    },
   },
  ]);
  res.status(200).json({
   status: 'success',
   data: {
    data: distances,
   },
  });
 }
);
