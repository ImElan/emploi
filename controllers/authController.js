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
