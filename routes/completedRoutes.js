const express = require('express');
const completedController = require('../controllers/completedController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

const { isAuthenticated } = authController;

const {
    getAllCompleted,
    getCompleted,
    addNewCompleted,
    updateCompleted,
    deleteCompleted,
    setCompletedBody,
} = completedController;

router.use(isAuthenticated);

router.route('/').get(getAllCompleted).post(setCompletedBody, addNewCompleted);
router.route('/:id').get(getCompleted).patch(updateCompleted).delete(deleteCompleted);

module.exports = router;
