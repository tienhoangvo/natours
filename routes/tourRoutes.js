const express = require('express');
const {
 getDistances,
 getToursWithin,
 getMonthlyPlan,
 getTourStats,
 aliasTopTours,
 getAllTours,
 createTour,
 getTour,
 updateTour,
 deleteTour,
 uploadTourImages,
 resizeTourImages,
} = require('../controllers/tourController');

const {
 protect,
 restrictTo,
} = require('./../controllers/authController');

const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// POST /tour/1234fad4/reviews
// GET /tour/1234fad4/reviews
// GET /tour/1234fad4/reviews/33421

// router
//   .route('/:tourId/reviews/')
//   .post(
//     protect,
//     restrictTo('user'),
//     createReview
//   );
router.use('/:tourId/reviews', reviewRouter);

router
 .route('/top-5-cheap')
 .get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
 .route('/monthly-plan/:year')
 .get(
  protect,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
 );

router.get(
 '/tours-within/:distance/center/:latlng/unit/:unit',
 getToursWithin
);

router.get(
 '/distances/:latlng/unit/:unit',
 getDistances
);
// /tours-distance?distance=2344&cente=-40,45&unit=mi
// /tours-within/2344/center/-40,45/unit/mi
router
 .route('/')
 .get(getAllTours)
 .post(
  protect,
  restrictTo('admin', 'lead-guide'),
  createTour
 );

router
 .route('/:id')
 .get(getTour)
 .patch(
  protect,
  restrictTo('admin', 'lead-guide'),
  uploadTourImages,
  resizeTourImages,
  updateTour
 )
 .delete(
  protect,
  restrictTo('admin', 'lead-guide'),
  deleteTour
 );

module.exports = router;
