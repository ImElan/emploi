const Team = require('../models/teamModel');
const Test = require('../models/testModel');

const isMemberOfSameTeam = async (testId, currentUserId) => {
    const test = await Test.findById(testId);
    const team = await Team.findById(test.team.id).populate('members');
    const currentUserNotInTeam = team.members.every(
        (member) => member.user.id !== currentUserId
    );
    return !currentUserNotInTeam;
};

module.exports = isMemberOfSameTeam;
