const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A member should have a user id.'],
        },
        team: {
            type: mongoose.Schema.ObjectId,
            ref: 'Team',
            required: [true, 'A member should belong to a team.'],
        },
        joinedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// To ensure there is no duplicates (same user is not joined in the same team twice)
memberSchema.index({ user: 1, tour: 1 }, { unique: true });

memberSchema.pre(/^find/, function (next) {
    // No need to populate team because we'll get all members of a team when a particular team is queried so the team content will already be there.
    this.populate({
        path: 'user',
        select: 'name email',
    });
    next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
