const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = userController;

const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    isAuthenticated,
    restrictTo,
} = authController;

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').post(resetPassword);

router.use(isAuthenticated);

router.route('/myProfile').get(getProfile, getUser);
router.route('/updatePassword').patch(updatePassword);
router.route('/updateProfile').patch(updateProfile);
router.route('/deleteProfile').delete(deleteProfile);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
