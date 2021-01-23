const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTeams = (req, res, next) => {
    console.log(req.body);
    res.status(200).json({
        status: 'success',
        message: 'Get All Teams Route.',
    });
};

exports.getTeam = (req, res, next) => {};
