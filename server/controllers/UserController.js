const User = require("../models/userSchema.js");
const argon2 = require("argon2");
// const generateToken = require("../utils/generateToken.js");

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

exports.fetchUserData = fetchUserData;
exports.updateUserData = updateUserData;
