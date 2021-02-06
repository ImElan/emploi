const isRepOfSameTeam = (team, userId) => {
    const isRepNotInTeam = team.reps.every((rep) => rep.id.toString() !== userId);
    if (isRepNotInTeam) {
        return false;
    }
    return true;
};

module.exports = isRepOfSameTeam;
