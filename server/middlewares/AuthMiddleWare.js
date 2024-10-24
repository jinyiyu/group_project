const jwt = require("jsonwebtoken");
const validator = require("validator");

const accessValidation = (req, res, next) => {
    const token = req.cookies.token;
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTlhOGRlYzgyZGExYmQxZGNiYzZjNCIsInVzZXJuYW1lIjoidGVzdDEiLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE3Mjk3MzcwMzUsImV4cCI6MTcyOTc0MDYzNX0.IGjQ067wKacBicL-w7dvLbfZCnaTRLVv5jpnaPuZkWo";
    console.log(token);

    if (!token || validator.isEmpty(token)) {
        return res.status(401).json({ message: "Token is required" });
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
    req.body.email = "test1@gmail.com"
    

    // if (!token || validator.isEmpty(token)) {
    //     return res.status(403).json({ message: "Invalid link." });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.INVITE_TOKEN_SECRET);
    //     req.body.email = decoded.email;
    // } catch (error) {
    //     return res.status(401).json({ message: "Invalid url or url expired." });
    // }

    next();
};

const isEmployee = (req, res, next) => {
    if (req.body.user.role !== "employee") {
        return res.status(403).json({ message: "you are not a emplotee" });
    }
    else {
        next();
    }
}

exports.accessValidation = accessValidation;
exports.inviteUrlValidation = inviteUrlValidation;
exports.isEmployee = isEmployee;