const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');

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
