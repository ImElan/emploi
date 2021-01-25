const Test = require('../models/testModel');
const Team = require('../models/teamModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');

exports.setTestBody = (req, res, next) => {
    if (!req.body.team) {
        req.body.team = req.params.teamId;
    }
    next();
};

exports.getAllTest = catchAsync(async (req, res, next) => {
    /* 
        check if the team still exists, Imagine this situation...
            -> New team is created.
            -> Some test are assigned to it. (team property in test model points to it).
            -> That team is deleted.
            -> Now when you're querying for all the test in that particular test we should show an error like that test no longer exists.
    */
    const { teamId } = req.params;

    let filter = {};
    if (teamId) {
        const team = await Team.findById(teamId);
        // If the team was deleted after some tests were assigned to it.
        if (!team) {
            return next(new ErrorHandler('No Team exists with that given ID', 404));
        }
        filter = { team: teamId };
    }

    const tests = await Test.find(filter);
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
