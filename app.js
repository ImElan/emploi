const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');

const teamRouter = require('./routes/teamRoutes');
const testRouter = require('./routes/testRoutes');
const userRouter = require('./routes/userRoutes');
const memberRouter = require('./routes/memberRoutes');
const appliedRouter = require('./routes/appliedRoutes');
const completedRouter = require('./routes/completedRoutes');

const ErrorHandler = require('./utils/errorHandler');
const handleError = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body-parser, To read data from req.body
app.use(express.json({ limit: '10kb' }));

// cookie-parser
app.use(cookieParser());

// set security headers
app.use(helmet());

app.use(cors());
app.options('*', cors());
// app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Limit http req from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from your IP. Please try again after one hour',
});

app.use('/api', limiter);
app.use(compression());

app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/tests', testRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/applied', appliedRouter);
app.use('/api/v1/completed', completedRouter);

app.all('*', (req, res, next) => {
    const error = new ErrorHandler(`URL ${req.originalUrl} doesn't exists`, 404);
    next(error);
});

// Global Error Handler Middleware.
app.use(handleError);

module.exports = app;
