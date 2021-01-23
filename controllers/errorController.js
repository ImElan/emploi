const ErrorHandler = require('../utils/errorHandler');

const handleDatabaseCastError = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new ErrorHandler(message, 400);
};

const handleDatabaseDuplicationError = (error) => {
    const value = error.keyValue.name;
    const message = `Duplicate Field value : ${value}. Please use another value.`;
    return new ErrorHandler(message, 400);
};

const handleDatabaseValidationError = (error) => {
    const errors = [];
    // for (const err in error.errors) {
    //     errors.push(error.errors[err].message);
    // }

    const errorKeys = Object.keys(error.errors);
    errorKeys.forEach((key) => {
        errors.push(error.errors[key].message);
    });

    const message = `Invalid input data: ${errors.join(' ')}`;
    return new ErrorHandler(message, 400);
};

const handleJsonWebTokenError = () =>
    new ErrorHandler('Invalid Token. Please login again.', 401);

const handleTokenExpiredError = () =>
    new ErrorHandler('Your session has expired. Please login again', 401);

const sendErrorDev = (error, req, res) => {
    // Api Error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stack: error.stack,
            error: error,
        });
    }
};

const sendErrorProd = (error, req, res) => {
    // Api Error
    if (req.originalUrl.startsWith('/api')) {
        // Operational errors are errors which are created by us... invalid route,invalid id,... so we need to send this error bact to user.
        if (error.operationalError) {
            return res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            });
        }
        console.log(error);
        // Non operational errors(programming errors) we can't leak the details of these kinds of error to user..so we're just sending this simple message back.
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong...',
        });
    }
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let err = { ...error };
        err.message = error.message;
        // 1. Invalid Id.... these kind of error
        if (error.name === 'CastError') {
            err = handleDatabaseCastError(err);
        }

        // 2. Entering duplicate value.. these kind of error..
        if (error.code === 11000) {
            err = handleDatabaseDuplicationError(err);
        }

        // 3. Validation error, name has to be max of 7 letters... these kind of error
        if (error.name === 'ValidationError') {
            err = handleDatabaseValidationError(err);
        }

        if (error.name === 'JsonWebTokenError') {
            err = handleJsonWebTokenError();
        }

        if (error.name === 'TokenExpiredError') {
            err = handleTokenExpiredError();
        }
        sendErrorProd(err, req, res);
    }
};
