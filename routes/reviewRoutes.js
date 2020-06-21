const router = require('express').Router({
  mergeParams: true,
});

const {
  protect,
  restrictTo,
} = require('./../controllers/authController');

const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('./../controllers/reviewController');

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(
    restrictTo('user'),
    setTourUserIds,
    createReview
  );

router
  .route('/:id')
  .get(getReview)
  .delete(
    restrictTo('user', 'admin'),
    deleteReview
  )
  .patch(
    restrictTo('user', 'admin'),
    updateReview
  );

module.exports = router;
