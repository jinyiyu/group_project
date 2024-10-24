const jwt = require("jsonwebtoken");
const validator = require("validator");

const accessValidation = (req, res, next) => {
  const token = req.cookies.token;

  if (!token || validator.isEmpty(token)) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Server error verifying token" });
    }
  }
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

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid URL or URL expired." });
  }
};

exports.accessValidation = accessValidation;
exports.inviteUrlValidation = inviteUrlValidation;
