const Member = require('../models/memberModel');
const Team = require('../models/teamModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');

exports.setMemberBody = catchAsync(async (req, res, next) => {
    if (!req.body.team) req.body.team = req.params.teamId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
});

exports.getAllMembers = catchAsync(async (req, res, next) => {
    const { teamId } = req.params;

    let filter = {};
    if (teamId) {
        const team = await Team.findById(teamId);
        if (!team) {
            return new ErrorHandler('No Team exists with that given id.', 404);
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
