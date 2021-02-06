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

router.use(isAuthenticated);

router.route('/').get(getAllTest).post(restrictTo('rep', 'admin'), setTestBody, addNewTest);
router
    .route('/:id')
    .get(getTest)
    .patch(restrictTo('rep', 'admin'), updateTest)
    .delete(restrictTo('rep', 'admin'), deleteTest);

module.exports = router;
