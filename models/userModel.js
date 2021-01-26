const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provided email is not a valid email'],
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: ['user', 'admin', 'rep'],
            message: 'Role should be either admin,rep or user not anything else.',
        },
    },
    password: {
        type: String,
        required: [true, 'User must specify a password'],
        minLength: 8,
        select: false,
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'User must confirm his password'],
        validate: {
            validator: function (passConfirm) {
                return this.password === passConfirm;
            },
            message: 'Password and Password Confirmation does not match.',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    isActive: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    // If password is not modified then no need to encrypt it again.
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;
});

userSchema.methods.isPasswordCorrect = async function (passwordToCheck, correctPassword) {
    return await bcrypt.compare(passwordToCheck, correctPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
