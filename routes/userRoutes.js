const express = require('express');
const authController = require('../controllers/authController');

const { signUp } = authController;

const router = express.Router();

router.route('/signUp').post(signUp);

module.exports = router;
