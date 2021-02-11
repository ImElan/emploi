const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Team = require('../models/teamModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const isRepOfSameTeam = require('../utils/checkIfRepOfSameTeam');
const Member = require('../models/memberModel');

const getJwtToken = (id) =>
    jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_TEAM_INVITE_EXPIRATION_TIME,
    });

exports.getAllTeams = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Team.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate();
    const teams = await features.query;
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
    const team = await Team.findById(id).populate('members');

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
    req.body.createdBy = req.user.id;
    const team = await Team.create(req.body);
    // Generate codeToJoin...
    const codeToJoin = getJwtToken(team.id);
    team.codeToJoin = codeToJoin;
    team.reps.push(req.user.id);
    await team.save({ validateBeforeSave: false });

    const body = {
        team: team.id,
        user: req.user.id,
    };
    await Member.create(body);

    res.status(201).json({
        status: 'success',
        data: {
            document: team,
        },
    });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No Team was found with the given id', 404));
    }

    if (req.user.id !== team.createdBy.id && req.user.role !== 'admin') {
        return next(
            new ErrorHandler("You don't have the permission to perform this action.", 401)
        );
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedTeam,
        },
    });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No Team was found with the given id', 404));
    }

    if (req.user.id !== team.createdBy.id && req.user.role !== 'admin') {
        return next(
            new ErrorHandler("You don't have the permission to perform this action.", 401)
        );
    }

    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
        return next('No Team was found with the given id', 404);
    }

    /* MOVING THIS LOGIC TO PRE REMOVE MIDDLEWARE. */
    /* // Also delete all the tests that belongs to that team.
    await Test.deleteMany({ team: id }); */

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const sendInviteLink = (team, req, res, next) => {
    const inviteLink = `${req.protocol}://${req.get('host')}/api/v1/teams/join/${
        team.codeToJoin
    }`;
    res.status(200).json({
        status: 'success',
        codeToJoin: team.codeToJoin,
        data: {
            document: inviteLink,
        },
    });
};

exports.getInviteLink = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No Team with the given id.', 404));
    }

    if (!isRepOfSameTeam(team, req.user.id) && req.user.role !== 'admin') {
        return next(new ErrorHandler('Only Reps of the Team can get the invite link', 401));
    }

    sendInviteLink(team, req, res, next);
});

exports.joinTeam = catchAsync(async (req, res, next) => {
    const { codeToJoin } = req.params;
    const decodedPayload = await promisify(jwt.verify)(codeToJoin, process.env.JWT_SECRET_KEY);

    const teamId = decodedPayload.id;

    const team = await Team.findById(teamId);

    if (!team) {
        return next(new ErrorHandler('No team exists with the given id.', 404));
    }

    if (team.codeChangedAfterInviteIsIssued(decodedPayload.iat)) {
        return next(
            new ErrorHandler(
                "You're using old invite link. Please use the new invite link to join",
                401
            )
        );
    }

    const body = {
        team: teamId,
        user: req.user.id,
    };
    const member = await Member.create(body);
    res.status(200).json({
        status: 'success',
        data: {
            document: member,
        },
    });
});

exports.generateNewInviteLink = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No team exists with the given id.', 404));
    }

    if (!isRepOfSameTeam(team, req.user.id) && req.user.role !== 'admin') {
        return next(new ErrorHandler('Only Reps of the Team can get the invite link', 401));
    }

    const codeToJoin = getJwtToken(id);
    team.codeToJoin = codeToJoin;
    await team.save({ validateBeforeSave: false });
    sendInviteLink(team, req, res, next);
});
