const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
    {
        companyName: {
            type: String,
            unique: true,
            required: [true, 'A Test should have a company name.'],
        },
        eligibleBranches: {
            type: [String],
            required: [true, 'A Test should have eligible branches.'],
        },
        lastDateToApply: {
            type: Date,
            required: [true, 'Last Date To Apply has to be mentioned.'],
            validate: {
                validator: function (lastDate) {
                    return lastDate > Date.now();
                },
                message: 'Given date is already passed',
            },
        },
        selectionProcess: [
            {
                round: {
                    type: String,
                    required: [true, 'A Round must have a name.'],
                },
                dateTime: {
                    type: Date,
                    required: [true, 'A Round must have time and date mentioned.'],
                },
            },
        ],
        role: [String],
        criteria: {
            baseGPA: {
                type: Number,
                min: [1.0, "Base GPA can't be lower than 1.0"],
                max: [10.0, "Base GPA can't be higher than 10.0"],
            },
            basePercentageIn10th: {
                type: Number,
                min: [0, "Base percentage can't be lower than 0"],
                max: [100.0, "Base percentage can't be higher than 100.0"],
            },
            basePercentageIn12th: {
                type: Number,
                min: [0, "Base percentage can't be lower than 0"],
                max: [100.0, "Base percentage can't be higher than 100.0"],
            },
            arrearCriteria: String,
        },
        bond: {
            type: Boolean,
            default: false,
        },
        delinkingAmount: String,
        confirmationStatus: String,
        salaryDetails: {
            type: String,
            required: [true, 'A Test should have details about salary package.'],
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A Test must be created by a user.'],
        },
        team: {
            type: mongoose.Schema.ObjectId,
            ref: 'Team',
            required: [true, 'A test should belong to a team.'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

testSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'team',
        select: 'name degree department yearOfStudy',
    }).populate({
        path: 'createdBy',
        select: 'name email',
    });
    next();
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
