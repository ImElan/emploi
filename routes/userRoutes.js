const express = require('express');
const authController = require('../controllers/authController');

const { signUp, login, forgotPassword } = authController;

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);

module.exports = router;
