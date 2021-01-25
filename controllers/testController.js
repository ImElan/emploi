const Test = require('../models/testModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');

exports.getAllTest = catchAsync(async (req, res, next) => {
    const tests = await Test.find();
    res.status(200).json({
        status: 'success',
        data: {
            numTest: tests.length,
            document: tests,
        },
    });
});

exports.getTest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
        return next(new ErrorHandler('No Test was found with the given id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: test,
        },
    });
});

exports.addNewTest = catchAsync(async (req, res, next) => {
    const test = await Test.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: test,
        },
    });
});

exports.updateTest = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { id } = req.params;
    const updatedTest = await Test.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedTest) {
        return next(new ErrorHandler('No Test was found with the given id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedTest,
        },
    });
});

exports.deleteTest = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
        return next(new ErrorHandler('No Test was found with the given id', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
