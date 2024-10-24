const jwt = require("jsonwebtoken");
const validator = require("validator");

const accessValidation = (req, res, next) => {
  const token = req.cookies.token;

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

// Hieu Tran - inviteUrlValidation
const inviteUrlValidation = (req, res, next) => {
  const token = req.params.token;

  // Check if the token is provided
  if (!token || validator.isEmpty(token)) {
    return res.status(403).json({ message: "Invalid link." });
  }

  try {
    // Verify and decode the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded email to the request body for further use
    req.body.email = decoded.email;

    // Optionally, you can attach other decoded data like fullName if needed
    // req.body.fullName = decoded.fullName;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid URL or URL expired." });
  }
};

// const inviteUrlValidation = (req, res, next) => {
//     const token = req.params.token;
//     // test
//     console.log(token);
//     req.body.email = "test@gmail.com"

//     // if (!token || validator.isEmpty(token)) {
//     //     return res.status(403).json({ message: "Invalid link." });
//     // }

//     // try {
//     //     const decoded = jwt.verify(token, process.env.INVITE_TOKEN_SECRET);
//     //     req.body.email = decoded.email;
//     // } catch (error) {
//     //     return res.status(401).json({ message: "Invalid url or url expired." });
//     // }

//     next();
// };

exports.accessValidation = accessValidation;
exports.inviteUrlValidation = inviteUrlValidation;
