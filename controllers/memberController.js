const Member = require('../models/memberModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const isRepOfSameTeam = require('../utils/checkIfRepOfSameTeam');

exports.setMemberBody = catchAsync(async (req, res, next) => {
    if (!req.body.team) req.body.team = req.params.teamId;
    next();
});

exports.getAllMembers = catchAsync(async (req, res, next) => {
    const { teamId } = req.params;

    let filter = {};
    if (teamId) {
        const team = await Team.findById(teamId);
        if (!team) {
            return next(new ErrorHandler('No Team exists with that given id.', 404));
        }
        filter = { team: teamId };
    }

    const features = new ApiFeatures(Member.find(filter), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate();

    const members = await features.query;
    res.status(200).json({
        status: 'success',
        data: {
            numMembers: members.length,
            document: members,
        },
    });
});

exports.getMember = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) {
        return next(new ErrorHandler('No member was found with the given id.', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            document: member,
        },
    });
});

exports.addNewMember = catchAsync(async (req, res, next) => {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
        return next(new ErrorHandler('No Team was found with the given id.', 404));
    }

    const user = await User.findById(req.body.user);
    if (!user) {
        return next(new ErrorHandler('No user was found with the given id.', 404));
    }

    if (!isRepOfSameTeam(team, req.user.id) && req.user.role !== 'admin') {
        return next(
            new ErrorHandler("You don't have permission to perform this action.", 401)
        );
    }

    const member = await Member.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            document: member,
        },
    });
});

exports.updateMember = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedMember = await Member.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedMember) {
        return next(new ErrorHandler('No Member was found with the given id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedMember,
        },
    });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);

    if (!member) {
        return next(new ErrorHandler('No Member was found with the given id', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
