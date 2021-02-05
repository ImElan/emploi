const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Test = require('../models/testModel');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Member = require('../models/memberModel');

dotenv.config({ path: '../config.env' });

const DATABASE = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// CONNECTING TO DATABASE
mongoose
    .connect(DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to database successfully...');
    });

// READING FILES
const tests = JSON.parse(fs.readFileSync(`${__dirname}/tests.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const teams = JSON.parse(fs.readFileSync(`${__dirname}/teams.json`, 'utf-8'));
const members = JSON.parse(fs.readFileSync(`${__dirname}/members.json`, 'utf-8'));

const loadData = async () => {
    try {
        await Test.create(tests);
        await Team.create(teams);
        await Member.create(members);
        await User.create(users, { validateBeforeSave: false });
        console.log('Data loaded successfully..');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Test.deleteMany();
        await Team.deleteMany();
        await Member.deleteMany();
        await User.deleteMany();
        console.log('Data deleted successfully..');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--load') {
    loadData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
