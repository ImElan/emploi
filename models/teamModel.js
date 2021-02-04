const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'A Team must have a name.'],
            minLength: [6, 'A Team name must have a minimum of 6 characters.'],
            maxLength: [30, 'A Team name must have a maximum of 30 characters.'],
        },
        degree: {
            type: String,
            required: [true, 'A Team must mention a Degree.'],
            enum: {
                values: ['UG', 'PG'],
                message: 'Degree must be either UG or PG not anything else.',
            },
        },
        department: {
            type: String,
            required: [true, 'A Team must mention a department.'],
        },
        yearOfStudy: {
            type: Number,
            required: [true, 'A Team must mention the year of study.'],
            min: 1,
            max: 4,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A Team must specify a creator'],
        },
        reps: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        codeToJoin: String,
        codeToJoinChangedAt: Date,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

teamSchema.pre('save', function (next) {
    if (!this.isModified('codeToJoin') || this.isNew) {
        return next();
    }
    this.codeToJoinChangedAt = Date.now() - 1000;
    next();
});

teamSchema.methods.codeChangedAfterInviteIsIssued = function (inviteIssuedTimestamp) {
    if (this.codeToJoinChangedAt) {
        const changedTimeStamp = parseInt(this.codeToJoinChangedAt.getTime() / 1000, 10);
        return changedTimeStamp > inviteIssuedTimestamp;
    }
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
