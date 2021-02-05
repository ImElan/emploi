const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require('../controllers/authController');
const repsController = require('../controllers/repsController');

const testRouter = require('./testRoutes');
const memberRouter = require('./memberRoutes');

const router = express.Router();

const {
    getAllTeams,
    addNewTeam,
    getTeam,
    updateTeam,
    deleteTeam,
    getInviteLink,
    joinTeam,
    generateNewInviteLink,
} = teamController;

const { isAuthenticated, restrictTo } = authController;

const { addNewRepToTeam, deleteRepFromTeam } = repsController;

router.route('/getInviteLink/:id').get(isAuthenticated, restrictTo('rep'), getInviteLink);
router.route('/join/:codeToJoin').post(isAuthenticated, joinTeam);
router
    .route('/generateNewInviteLink/:id')
    .get(isAuthenticated, restrictTo('rep'), generateNewInviteLink);

router
    .route('/')
    .get(isAuthenticated, getAllTeams)
    .post(isAuthenticated, restrictTo('rep'), addNewTeam);
router.route('/:id').get(getTeam).patch(updateTeam).delete(deleteTeam);

router.route('/:teamId/reps/:userId').post(addNewRepToTeam).delete(deleteRepFromTeam);

// Nested Routes for Teams / Tests.
router.use('/:teamId/tests', testRouter);

// Nested Routes for Teams / Members.
router.use('/:teamId/members', memberRouter);

module.exports = router;
