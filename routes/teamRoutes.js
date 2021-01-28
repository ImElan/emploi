const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require('../controllers/authController');

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
} = teamController;
const { isAuthenticated, restrictTo } = authController;

router.route('/getInviteLink/:id').get(isAuthenticated, restrictTo('rep'), getInviteLink);
router.route('/join/:codeToJoin').post(isAuthenticated, joinTeam);

router
    .route('/')
    .get(isAuthenticated, getAllTeams)
    .post(isAuthenticated, restrictTo('rep'), addNewTeam);
router.route('/:id').get(getTeam).patch(updateTeam).delete(deleteTeam);

// Nested Routes for Teams / Tests.
router.use('/:teamId/tests', testRouter);

// Nested Routes for Teams / Members.
router.use('/:teamId/members', memberRouter);

module.exports = router;
