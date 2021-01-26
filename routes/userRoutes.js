const express = require('express');
const authController = require('../controllers/authController');

const { signUp, login } = authController;

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);

module.exports = router;
