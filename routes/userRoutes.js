const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { updateProfile, deleteProfile } = userController;

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

router.use(isAuthenticated);

router.route('/updatePassword').patch(updatePassword);
router.route('/updateProfile').patch(updateProfile);
router.route('/deleteProfile').delete(deleteProfile);

module.exports = router;
