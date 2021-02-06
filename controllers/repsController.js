const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');
const isRepOfSameTeam = require('../utils/checkIfRepOfSameTeam');

const Team = require('../models/teamModel');
const User = require('../models/userModel');

exports.addNewRepToTeam = catchAsync(async (req, res, next) => {
    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
        return next(new ErrorHandler('No team was found with the given id.', 404));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('No user was found with the given id.', 404));
    }

    if (user.role !== 'rep') {
        return next(new ErrorHandler('Given user is not a rep', 400));
    }

    if (!isRepOfSameTeam(team, req.user.id) && req.user.role !== 'admin') {
        return next(
            new ErrorHandler("You don't have permission to perform this action.", 401)
        );
    }

    team.reps.push(userId);
    await team.save();
    res.status(200).json({
        status: 'success',
        message: `User with userId ${userId} has been added as rep to team with teamId ${teamId}.`,
        data: {
            document: team.reps,
        },
    });
});

exports.deleteRepFromTeam = catchAsync(async (req, res, next) => {
    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
        return next(new ErrorHandler('No team was found with the given id.', 404));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('No user was found with the given id.', 404));
    }

    if (!isRepOfSameTeam(team, req.user.id) && req.user.role !== 'admin') {
        return next(
            new ErrorHandler("You don't have permission to perform this action.", 401)
        );
    }

    if (!isRepOfSameTeam(team, userId)) {
        return next(new ErrorHandler('Given user is not a rep of the team.', 400));
    }

    const currentReps = team.reps;
    const updatedReps = currentReps.filter((repsId) => repsId.id !== userId);

    team.reps = updatedReps;
    await team.save();
    res.status(200).json({
        status: 'success',
        message: `User with userId ${userId} has been deleted from reps in team with teamId ${teamId}.`,
        data: {
            document: updatedReps,
        },
    });
});
