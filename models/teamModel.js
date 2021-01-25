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
        codeToJoin: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
