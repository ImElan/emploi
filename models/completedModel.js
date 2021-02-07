const mongoose = require('mongoose');

const completedSchema = mongoose.Schema(
    {
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

completedSchema.index({ user: 1, test: 1 }, { unique: true });

const Completed = mongoose.model('Completed', completedSchema);

module.exports = Completed;
