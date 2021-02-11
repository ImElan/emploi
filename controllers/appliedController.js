const Applied = require('../models/appliedModel');
const User = require('../models/userModel');
const Test = require('../models/testModel');
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const isMemberOfSameTeam = require('../utils/checkIfMemberOfSameTeam');

exports.setAppliedBody = (req, res, next) => {
    if (!req.body.user) req.body.user = req.params.userId;
    next();
};

exports.getAllApplied = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    let filter = {};
    if (userId) {
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler('No user with the given id.', 404));
        }

        filter = { user: userId };
    }

    const features = new ApiFeatures(Applied.find(filter), req.query)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const applied = await features.query;

    res.status(200).json({
        status: 'success',
        numApplied: applied.length,
        data: {
            document: applied,
        },
    });
});

exports.addNewApplied = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return next(new ErrorHandler('No user exists with the given Id.', 404));
    }

    const test = await Test.findById(req.body.test);
    if (!test) {
        return next(new ErrorHandler('No test exists with the given Id.', 404));
    }

    if (
        !(await isMemberOfSameTeam(req.body.test, req.params.userId)) &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorHandler(
                "You don't belong in this team to mark this test as applied.",
                401
            )
        );
    }

    const applied = await Applied.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: applied,
        },
    });
});

exports.getApplied = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const applied = await Applied.findById(id);

    if (!applied) {
        return next(new ErrorHandler('No Applied Test was found with the given id.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: applied,
        },
    });
});

exports.updateApplied = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const currentApplied = await Applied.findById(id);

    if (!currentApplied) {
        return next(new ErrorHandler('No Applied Test was found with the given id.', 404));
    }

    if (currentApplied.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler("You don't have permission to do this action.", 401));
    }

    const updatedApplied = await Applied.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedApplied,
        },
    });
});

exports.deleteApplied = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const currentApplied = await Applied.findById(id);

    if (!currentApplied) {
        return next(new ErrorHandler('No Applied Test was found with the given id.', 404));
    }

    if (currentApplied.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorHandler("You don't have permission to do this action.", 401));
    }

    await Applied.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
