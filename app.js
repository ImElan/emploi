const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const teamRouter = require('./routes/teamRoutes');
const testRouter = require('./routes/testRoutes');
const userRouter = require('./routes/userRoutes');

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

app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/tests', testRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    const error = new ErrorHandler(`URL ${req.originalUrl} doesn't exists`, 404);
    next(error);
});

// Global Error Handler Middleware.
app.use(handleError);

module.exports = app;
