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

const { isAuthenticated } = authController;

router.route('/').get(getAllMembers).post(isAuthenticated, setMemberBody, addNewMember);
router.route('/:id').get(getMember).patch(updateMember).delete(deleteMember);

module.exports = router;
