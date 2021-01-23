const express = require('express');

const teamController = require('../controllers/teamController');

const router = express.Router();

const { getAllTeams } = teamController;

router.route('/').get(getAllTeams);

module.exports = router;
