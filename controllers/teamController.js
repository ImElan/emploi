const Team = require('../models/teamModel');
const Test = require('../models/testModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');

exports.getAllTeams = catchAsync(async (req, res, next) => {
    const teams = await Team.find();
    res.status(200).json({
        status: 'success',
        data: {
            numTeams: teams.length,
            document: teams,
        },
    });
});

exports.getTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No Team was found with the given id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: team,
        },
    });
});

exports.addNewTeam = catchAsync(async (req, res, next) => {
    const team = await Team.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: team,
        },
    });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedTeam) {
        return next('No Team was found with the given id', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedTeam,
        },
    });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
        return next('No Team was found with the given id', 404);
    }

    // Also delete all the tests that belongs to that team.
    await Test.deleteMany({ team: id });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
