const express = require('express');
const authController = require('../controllers/authController');

const { signUp, login, forgotPassword, resetPassword } = authController;

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').post(resetPassword);

module.exports = router;
