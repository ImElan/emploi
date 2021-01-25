const express = require('express');

const teamRouter = require('./routes/teamRoutes');
const testRouter = require('./routes/testRoutes');

const ErrorHandler = require('./utils/errorHandler');
const handleError = require('./controllers/errorController');

const app = express();

// Body-parser, To read data from req.body
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/tests', testRouter);

app.get('*', (req, res, next) => {
    const error = new ErrorHandler(`URL ${req.originalUrl} doesn't exists`, 404);
    next(error);
});

// Global Error Handler Middleware.
app.use(handleError);

module.exports = app;
