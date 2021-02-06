const Completed = require('../models/completedModel');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.setCompletedBody = (req, res, next) => {
    if (!req.body.user) req.body.user = req.params.userId;
    next();
};

exports.getAllCompleted = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    let filter = {};
    if (userId) {
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler('No user with the given id.', 404));
        }

        filter = { user: userId };
    }

    const features = new ApiFeatures(Completed.find(filter), req.query)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const completed = await features.query;

    res.status(200).json({
        status: 'success',
        data: {
            document: completed,
        },
    });
});

exports.addNewCompleted = catchAsync(async (req, res, next) => {
    const completed = await Completed.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: completed,
        },
    });
});

exports.getCompleted = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const completed = await Completed.findById(id);

    if (!completed) {
        return next(new ErrorHandler('No Completed Test was found with the given id.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: completed,
        },
    });
});

exports.updateCompleted = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const currentCompleted = await Completed.findById(id);

    if (!currentCompleted) {
        return next(new ErrorHandler('No Completed Test was found with the given id.', 404));
    }

    if (currentCompleted.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler("You don't have permission to do this action.", 401));
    }

    const updatedCompleted = await Completed.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedCompleted,
        },
    });
});

exports.deleteCompleted = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const currentCompleted = await Completed.findById(id);

    if (!currentCompleted) {
        return next(new ErrorHandler('No Completed Test was found with the given id.', 404));
    }

    if (currentCompleted.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler("You don't have permission to do this action.", 401));
    }

    await Completed.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
