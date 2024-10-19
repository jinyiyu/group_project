const User = require("../models/userSchema.js");
const House = require("../models/houseSchema.js");
const argon2 = require("argon2");
// const generateToken = require("../utils/generateToken.js");
const {genAccessToken} = require("../utils/genJwtToken.js");

// fetch user data(nested object)
// will return specific fields if given in the query string
const fetchUserData = async(req, res) => {
  // const { userId } = req.body;
  const userId = "6711ed1baa0764012569e17d";
  const { fields } = req.query;

  try {
    let filter = ''; //TODO_ldl: needs a middleware before this function to validate the filter
    if (fields) {
      filter = fields.split(';').join(' ');
    }

    const user = await User.findById(userId).select(filter).lean().exec();
    return res.status(200).json({user});
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}

// update user data
// data can be nested object, should follow the data model, can be partial
const updateUserData = async(req, res) => {
  // const { userId, data } = req.body;
  const { data } = req.body;//TODO_ldl: might need middleware before this function to verify the data is in correct structure
  const userId = "6711ed1baa0764012569e17d";

  try {
    // Use $set to update nested fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).lean().exec();

    if (!updatedUser) {
      return res.status(500).json({ message: `DB update error for ${userId, data}` });
    }

    return res.status(200).json({updatedUser});
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}


// regisiter 
const register = async(req, res) => {
  const {username, password} = req.body;
  const email = req.body.email;
  try{
    // check duplicate username
    const dupUsername = await User.findOne({username}).lean().exec();
    if(dupUsername){
      return res.status(400).json({ message: "Username already exists" });
    }
    // check duplicate email
    const dupEmail = await User.findOne({email}).lean().exec();
    if(dupEmail){
      return res.status(400).json({ message: "Email already exists" });
    }
    // hash password
    const hashedPassword = await argon2.hash(password);

    // random find a house
    const randomHouse = await House.aggregate([{ $sample: { size: 1 } }]);

    const user_query = {
      userName: username,
      password: hashedPassword,
      email,
      role: "employee",
      house: randomHouse[0]._id,
    }
    console.log(user_query);
    const newUser = await User.create(user_query);
    const accessToken = genAccessToken(newUser._id, newUser.userName, newUser.role);
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
  });
  return res.status(201).json({ message: `${username} registered successfully` });

  }catch(error){
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }

}

// login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
      // check if user exists
      const user = await User.findOne({userName:username}).lean().exec();
      if (!user) {
          return res
              .status(401)
              .json({ message: "Invalid username or password" });
      }

      // check if password is correct
      const isPasswordCorrect = await argon2.verify(user.password, password);
      if (!isPasswordCorrect) {
          return res
              .status(401)
              .json({ message: "invalid user or password" });
      }

      // generate access token
      const token = genAccessToken(user._id, user.username, user.role);

      res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
      });

      return res.status(200).json({ message: "Login successful" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
  }
};

// validate register URL
const validRegisterURL = async (req, res) => {
  return res.status(200).json({ message: "Valid register URL", email: req.body.email });
};

exports.fetchUserData = fetchUserData;
exports.updateUserData = updateUserData;
exports.register = register;  
exports.login = login;
exports.validRegisterURL = validRegisterURL;