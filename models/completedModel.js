const mongoose = require('mongoose');

const completedSchema = mongoose.Schema({
    test: {
        type: mongoose.Schema.ObjectId,
        ref: 'Test',
        required: [true, 'Completed test should refer to a test.'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Completed test should belong to a user.'],
    },
    completedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Completed = mongoose.model('Completed', completedSchema);

module.exports = Completed;
