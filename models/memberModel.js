const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
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
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
