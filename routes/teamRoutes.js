const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

const { getAllTeams, addNewTeam, getTeam, updateTeam, deleteTeam } = teamController;

router.route('/').get(getAllTeams).post(addNewTeam);
router.route('/:id').get(getTeam).patch(updateTeam).delete(deleteTeam);

module.exports = router;
