const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Team = require('../models/teamModel');
const Test = require('../models/testModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
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

exports.getInviteLink = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
        return next(new ErrorHandler('No Team with the given id.', 404));
    }

    const inviteLink = `${req.protocol}://${req.get('host')}/api/v1/teams/join/${
        team.codeToJoin
    }`;
    res.status(200).json({
        status: 'success',
        data: {
            document: inviteLink,
        },
    });
});

exports.joinTeam = catchAsync(async (req, res, next) => {
    const { codeToJoin } = req.params;
    const decodedPayload = await promisify(jwt.verify)(codeToJoin, process.env.JWT_SECRET_KEY);

    const teamId = decodedPayload.id;

    const team = await Team.findById(teamId);

    if (!team) {
        return next(new ErrorHandler('No team exists with the given id.', 404));
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
