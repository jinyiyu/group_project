const User = require("../models/User.js");
const argon2 = require("argon2");
// const generateToken = require("../utils/generateToken.js");

// fetch user data(nested object)
// will return specific fields if given in the query string
const fetchUserData = async(req, res) => {
  const { userId } = req.body;
  const { fields } = req.query;

  try {
    let filter = ''; //TODO_ldl: needs a middleware before this function to validate the filter
    if (fields) {
      filter = fields.split(';').join(' ');  // Convert fields into a space-separated string for .select()
    }

    const user = await User.findById(userId).select(filter).lean().exec();
    return res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}

// update user data(data has to be nested object sent from the frontend, should follow the data model, can be partial)
const updateUserData = async(req, res) => {
  const { userId, data } = req.body;//TODO_ldl: might need middleware before this function to verify the data is in correct structure

  try {
    // Use $set to update nested fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).lean().exec();

    if (!updatedUser) {
      return res.status(500).json({ message: `DB update error for ${userId, data}` });
    }

    return res.status(200).json(updatedUser);
  }
  catch (error) {
    res.status(500).json({ message: `${error}` });
  }
}