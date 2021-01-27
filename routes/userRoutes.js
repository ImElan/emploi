const express = require('express');
const authController = require('../controllers/authController');

const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    isAuthenticated,
} = authController;

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').post(resetPassword);
router.route('/updatePassword').patch(isAuthenticated, updatePassword);

module.exports = router;
