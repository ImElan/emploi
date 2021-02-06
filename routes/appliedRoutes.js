const express = require('express');
const appliedController = require('../controllers/appliedController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

const { isAuthenticated, restrictTo } = authController;

const {
    getAllApplied,
    getApplied,
    addNewApplied,
    updateApplied,
    deleteApplied,
    setAppliedBody,
} = appliedController;

router.use(isAuthenticated);

router.route('/').get(getAllApplied).post(setAppliedBody, addNewApplied);
router.route('/:id').get(getApplied).patch(updateApplied).delete(deleteApplied);

module.exports = router;
