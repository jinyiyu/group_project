const User = require("../models/userSchema.js");
const House = require("../models/houseSchema.js");
const basicUser = require("../models/basicUserSchema.js");
const tokenHistory = require("../models/tokenHistorySchema.js");
const argon2 = require("argon2");
// const generateToken = require("../utils/generateToken.js");
const { genAccessToken } = require("../utils/genJwtToken.js");
const jwt = require("jsonwebtoken");

// fetch user data(nested object)
// will return specific fields if given in the query string
const fetchUserData = async (req, res) => {
  // const { userId } = req.body;
  const userId = "6717d2d7cd4fb7e80481f379";
  const { fields } = req.query;

  try {
    let filter = ""; //TODO_ldl: needs a middleware before this function to validate the filter
    if (fields) {
      filter = fields.split(";").join(" ");
    }

    const user = await User.findById(userId).select(filter).lean().exec();
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

// update user data
// data can be nested object, should follow the data model, can be partial
const updateUserData = async (req, res) => {
  // const { userId, data } = req.body;
  const { data } = req.body; //TODO_ldl: might need middleware before this function to verify the data is in correct structure
  const userId = "6717d2d7cd4fb7e80481f379";

  try {
    // Use $set to update nested fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: `DB update error for ${(userId, data)}` });
    }

    return res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

// Hieu Tran - new register
const register = async (req, res) => {
  const { token } = req.params;
  const { username, password, role } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, fullName } = decoded;

    // Split the fullName into firstName and lastName
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Check if the username or email already exists on both User and Basic User
    const userExists = await User.findOne({ userName: username });
    const basicUserExists = await basicUser.findOne({ userName: username });
    const emailExists = await User.findOne({ "userProfile.email": email });
    const basicEmailExists = await basicUser.findOne({
      "userProfile.email": email,
    });

    if (userExists || basicUserExists) {
      return res.status(409).json({ message: "Username already exists." });
    }

    if (emailExists || basicEmailExists) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Randomly assign a house
    const randomHouse = await House.aggregate([{ $sample: { size: 1 } }]);

    const userRole = role || "employee";

    // Create the new basic user
    const newBasicUser = new basicUser({
      userName: username,
      password: hashedPassword,
      userProfile: { email, firstName, lastName },
      role: userRole,
      house: randomHouse[0]._id,
    });

    await newBasicUser.save();

    const accessToken = genAccessToken(
      newBasicUser._id,
      newBasicUser.userName,
      newBasicUser.role
    );

    const matchHistory = await tokenHistory.findOne({ email });
    // const nameMatchHistory = await tokenHistory.findOne({})
    if (matchHistory) {
      matchHistory.status = "registered";
      await matchHistory.save();
      console.log(matchHistory.status);
    } else {
      console.log("No match found in token history");
    }

    // Set cookie for future requests
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(201).json({
      message: `${username} registered successfully`,
      matchHistoryStatus: matchHistory.status,
      accessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Registration link has expired." });
    }

    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Registration failed." });
  }
};

// Hieu Tran - get basic user for testing purposes
exports.getBasicUsers = async (req, res) => {
  try {
    const users = await basicUser.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// old register by Hansen
// const register = async (req, res) => {
//   const { username, password } = req.body;
//   const email = req.body.email;
//   try {
//     // check duplicate username
//     const dupUsername = await User.findOne({ userName: username })
//       .lean()
//       .exec();
//     if (dupUsername) {
//       return res.status(409).json({ message: "Username already exists" });
//     }
//     console.log("email: ", email);
//     // check duplicate email
//     const dupEmail = await User.findOne({ "userProfile.email": email })
//       .lean()
//       .exec();
//     if (dupEmail) {
//       return res.status(409).json({ message: "Email already exists" });
//     }
//     // hash password
//     const hashedPassword = await argon2.hash(password);

//     // random find a house
//     const randomHouse = await House.aggregate([{ $sample: { size: 1 } }]);

//     const user_query = {
//       userName: username,
//       password: hashedPassword,
//       email,
//       role: "employee",
//       house: randomHouse[0]._id,
//     };
//     console.log(user_query);
//     const newUser = await User.create(user_query);
//     const accessToken = genAccessToken(
//       newUser._id,
//       newUser.userName,
//       newUser.role
//     );
//     res.cookie("token", accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//     });
//     return res
//       .status(201)
//       .json({ message: `${username} registered successfully` });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: `${error}` });
//   }
// };

// login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if user exists
    let user = await User.findOne({ userName: username }).lean().exec();
    if (!user) {
      user = await basicUser.findOne({ userName: username }).lean().exec();
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    }

    // check if password is correct
    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid user or password" });
    }

    // generate access token
    const token = genAccessToken(user._id, user.userName, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.userName,
        role: user.role,
        id: user._id,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error });
  }
};

// is logged in
const isLoggedIn = async (req, res) => {
  return res.status(200).json({
    message: "Logged in",
    user: {
      username: req.user.userName,
      role: req.user.role,
    },
  });
};

// validate register URL
const validRegisterURL = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Valid register URL", email: req.body.email });
};

exports.fetchUserData = fetchUserData;
exports.updateUserData = updateUserData;
exports.register = register;
exports.login = login;
exports.validRegisterURL = validRegisterURL;
exports.logout = logout;
exports.isLoggedIn = isLoggedIn;
