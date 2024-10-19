const validator = require("validator");

const passwordValidation = (req, res, next) => {
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Password is too weak!" });
    }

    next();
};

const fieldsValidation = (req, res, next) => {
    const { username, password, confirmPassword, email } = req.body;
    if (
        !username ||
        validator.isEmpty(username) ||
        !password ||
        validator.isEmpty(password) ||
        !confirmPassword ||
        validator.isEmpty(confirmPassword) ||
        !email ||
        validator.isEmpty(email)
    ) {
        return res.status(400).json({ message: "Missing required fields!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }
    // email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email!" });
    }
    // username validation
    if (!validator.isAlphanumeric(username)) {
        return res
            .status(400)
            .json({ message: "Username must be alphanumeric!" });
    }
    next();
};

exports.passwordValidation = passwordValidation;
exports.fieldsValidation = fieldsValidation;

