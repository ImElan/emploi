const express = require('express');
const authController = require('../controllers/authController');
const memberController = require('../controllers/memberController');

const router = express.Router({ mergeParams: true });

const {
    setMemberBody,
    getAllMembers,
    getMember,
    updateMember,
    addNewMember,
    deleteMember,
} = memberController;

const { isAuthenticated, restrictTo } = authController;

router.use(isAuthenticated);
router.route('/').get(getAllMembers).post(setMemberBody, addNewMember);
router
    .route('/:id')
    .get(getMember)
    .patch(restrictTo('admin'), updateMember)
    .delete(restrictTo('rep', 'admin'), deleteMember);

module.exports = router;
