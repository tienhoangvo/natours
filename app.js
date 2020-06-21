const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
//Serving static files
app.use(
 express.static(path.join(__dirname, 'public'))
);

// Set security HTTP headers
app.use(helmet());
app.use(
 helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' })
);
// Development logging
if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
 max: 1000,
 windowMs: 60 * 60 * 100,
 message:
  'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
 express.json({
  limit: '10kb',
 })
);
app.use(
 express.urlencoded({
  extended: true,
  limit: '10kb',
 })
);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
 hpp({
  whitelist: [
   'duration',
   'ratingsQuantity',
   'ratingsAverage',
   'maxGroupSize',
   'difficulty',
   'price',
  ],
 })
);

// Test middlewares
app.use((req, res, next) => {
 req.requestTime = new Date().toISOString();
 console.log(req.cookies);
 next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
 next(
  new AppError(
   `Can't find ${req.originalUrl} on this serve`,
   404
  )
 );
 // if next function recieves an argument, no matter what it is express will automaticly know that there was an error => the application will skip all the other middleware in the middleware stack go straight err handling middle
});

app.use(globalErrorHandler);

module.exports = app;
