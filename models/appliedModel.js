const mongoose = require('mongoose');

const appliedSchema = mongoose.Schema(
    {
        test: {
            type: mongoose.Schema.ObjectId,
            ref: 'Test',
            required: [true, 'Applied test should refer to a test.'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Applied test should belong to a user.'],
        },
        appliedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

appliedSchema.index({ user: 1, test: 1 }, { unique: true });

appliedSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user' }).populate({
        path: 'test',
        select: 'companyName salaryDetails criteria',
    });
    next();
});

const Applied = mongoose.model('Applied', appliedSchema);

module.exports = Applied;
