const jwt = require("jsonwebtoken");

const genAccessToken = (id, username, role) => {
    const token = jwt.sign({ id, username, role}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    return token;
};

const genInviteToken = (email) => {
    const token = jwt.sign({ email }, process.env.INVITE_TOKEN_SECRET, {
        expiresIn: "3h",
    });
    return token;
};
exports.genAccessToken = genAccessToken;
exports.genInviteToken = genInviteToken;
