const express = require('express');
const teamController = require('../controllers/teamController');

const testRouter = require('./testRoutes');

const router = express.Router();

const { getAllTeams, addNewTeam, getTeam, updateTeam, deleteTeam } = teamController;

router.route('/').get(getAllTeams).post(addNewTeam);
router.route('/:id').get(getTeam).patch(updateTeam).delete(deleteTeam);

// To get tests on a particular team.
router.use('/:teamId/tests', testRouter);

module.exports = router;
