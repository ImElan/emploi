const express = require('express');

const ErrorHandler = require('./utils/errorHandler');

const app = express();

app.get('/', (req, res) => {
    res.send('Home route');
});

app.get('*', (req, res, next) => {
    const error = new ErrorHandler(`URL ${req.originalUrl} doesn't exists`, 404);
    next(error);
});

// Global Error Handler Middleware.
app.use();

module.exports = app;
