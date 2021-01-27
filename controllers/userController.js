const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');
const { findByIdAndDelete } = require('../models/userModel');

const filterBody = (body, ...allowedFields) => {
    const filteredBody = { ...body };
    Object.keys(filteredBody).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete filteredBody[field];
        }
    });
    return filteredBody;
};

exports.updateProfile = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirmation) {
        return next(
            new ErrorHandler(
                "You can't update your password using this link. Use /updatePassword or /forgotPassword link",
                400
            )
        );
    }

    const filteredBody = filterBody(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedUser,
        },
    });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getProfile = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        numUsers: users.length,
        data: {
            document: users,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new ErrorHandler('No user was found with that given id.', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            document: user,
        },
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });

    if (!updatedUser) {
        return next(new ErrorHandler('No user was found with that given id.', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            document: updatedUser,
        },
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await findByIdAndDelete(id);
    if (!user) {
        return next(new ErrorHandler('No user was found with that given id.', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
