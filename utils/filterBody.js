const filterBody = (body, ...allowedFields) => {
    const filteredBody = { ...body };
    Object.keys(filteredBody).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete filteredBody[field];
        }
    });
    return filteredBody;
};

module.exports = filterBody;
