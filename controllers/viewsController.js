const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(
 async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();

  //2) Build template

  //3) Render that template tour data from 1)
  res.status(200).render('overview', {
   title: 'All Tours',
   tours,
  });
 }
);

exports.getTour = catchAsync(
 async (req, res, next) => {
  // 1) Get requested Tour
  const tour = await Tour.findOne({
   slug: req.params.slug,
  }).populate('reviews');

  if (!tour) {
   return next(
    new AppError(
     'There is no tour with that name',
     404
    )
   );
  }

  console.log(tour.reviews);

  res.status(200).render('tour', {
   title: tour.name,
   tour,
  });
 }
);

exports.getLoginForm = (req, res) => {
 res
  .status(200)
  .render('login', { title: 'Sign in' });
};

exports.getSignupForm = (req, res) => {
 res
  .status(200)
  .render('signup', { title: 'Sign up' });
};

exports.getAccount = (req, res) => {
 res.status(200).render('account', {
  title: 'Your account',
 });
};

exports.updateUserData = catchAsync(
 async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
   req.user.id,
   {
    name,
    email,
   },
   {
    new: true,
    runValidators: true,
   }
  );

  res.status(200).render('account', {
   title: 'Your account',
   user,
  });
 }
);

exports.getMyTours = catchAsync(
 async (req, res, next) => {
  // 1) Find all bookings
  console.log(req.user);
  const bookings = await Booking.find({
   user: req.user._id,
  });

  console.log(bookings);
  // 2) Find tours with the return IDs

  const tourIds = bookings.map(
   (booking) => booking.tour
  );

  const tours = await Tour.find({
   _id: { $in: tourIds },
  });

  res.status(200).render('overview', {
   title: 'My tours',
   tours,
  });
 }
);
