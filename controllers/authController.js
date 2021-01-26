const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');

const getJwtToken = (id) =>
    jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

const sendJwtToken = (user, statusCode, req, res) => {
    const tokenId = getJwtToken(user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRATION_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (req.secure) {
        cookieOptions.secure = true;
    }
    // console.log(req.secure);
    res.cookie('jwt', tokenId, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        tokenId,
        data: {
            document: {
                user,
            },
        },
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    sendJwtToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password to login', 400));
    }

    // have to use findOne because it only returns the document find returns cursor to that document... prototype methods can be called only on document.
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

    sendJwtToken(user, 200, req, res);
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
    let tokenId;
    if (req.headers.authorization) {
        tokenId = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        tokenId = req.cookies.jwt;
    }
    if (!tokenId) {
        return next(
            new ErrorHandler(
                "You're not logged in. Please Login to get access to this URL",
                401
            )
        );
    }

    const decodedPayload = await promisify(jwt.verify)(tokenId, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedPayload.id);

    if (!user) {
        return next(new ErrorHandler('Your account no longer exists.', 401));
    }

    if (user.isPasswordChangedAfterTokenIsIssued(decodedPayload.iat)) {
        return next(
            new ErrorHandler(
                'Your account password has been changed. Please login again to continue',
                401
            )
        );
    }

    req.user = user;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler("You're not allowed to access this route.", 401));
    }
    next();
};
