const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

const { getAllTest, getTest, addNewTest, updateTest, deleteTest } = testController;

router.route('/').get(getAllTest).post(addNewTest);
router.route('/:id').get(getTest).patch(updateTest).delete(deleteTest);

module.exports = router;
