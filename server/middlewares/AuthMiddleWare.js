const jwt = require("jsonwebtoken");
const validator = require("validator");

const accessValidation = (req, res, next) => {
    const token = req.cookies.token;

    if (!token || validator.isEmpty(token)) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.body.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
        };
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    next();
};

const inviteUrlValidation = (req, res, next) => {
    const token = req.params.token;
    // test
    console.log(token);
    req.body.email = "test@gmail.com"
    

    // if (!token || validator.isEmpty(token)) {
    //     return res.status(403).json({ message: "Invalid link." });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.INVITE_TOKEN_SECRET);
    //     req.body.email = decoded.email;
    // } catch (error) {
    //     return res.status(401).json({ message: "Invalid token or token expired." });
    // }

    next();
};

exports.accessValidation = accessValidation;
exports.inviteUrlValidation = inviteUrlValidation;