const express = require('express');
const testController = require('../controllers/testController');
const authController = require('../controllers/authController');

// we need to merge params because we'll be using :teamId param passed from teamRoutes.
const router = express.Router({ mergeParams: true });

const {
    setTestBody,
    getAllTest,
    getTest,
    addNewTest,
    updateTest,
    deleteTest,
} = testController;

const { isAuthenticated, restrictTo } = authController;

router
    .route('/')
    .get(getAllTest)
    .post(isAuthenticated, restrictTo('rep'), setTestBody, addNewTest);
router.route('/:id').get(getTest).patch(updateTest).delete(deleteTest);

module.exports = router;
