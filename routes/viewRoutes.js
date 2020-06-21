const router = require('express').Router();
const {
 getOverview,
 getTour,
 getLoginForm,
 getSignupForm,
 getAccount,
 updateUserData,
 getMyTours,
} = require('./../controllers/viewsController');

const {
 isLoggedIn,
 protect,
} = require('./../controllers/authController');

const {
 createBookingCheckout,
} = require('./../controllers/bookingController');

router.get('/me', protect, getAccount);
router.post(
 '/submit-user-data',
 protect,
 updateUserData
);

router.use(isLoggedIn);

router.get(
 '/',
 createBookingCheckout,
 getOverview
);

router.get('/tours/:slug', getTour);
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);
router.get('/my-tours', protect, getMyTours);

module.exports = router;
