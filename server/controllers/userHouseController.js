const User = require("../models/userSchema");
const Report = require("../models/reportSchema");
const House = require("../models/houseSchema");

// Take a userId, return a house address and list of user's roommates
exports.getHouseDetail = async (req, res) => {
  try {
    const userId = req.cookies.user_id;

    // From userSchema grab user info by Id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get houseId from userSchema
    const houseId = user.house;
    // Get house info from houseSchema by houseId
    const house = await House.findById(houseId);

    if (!house) {
      return res
        .status(404)
        .json({ message: "User is not assigned to a house" });
    }

    // Get user's first and last names from userSchema by houseId,
    // but exclude the current user by userId
    const roommates = await User.find({
      house: houseId,
      _id: { $ne: userId },
    }).select("userProfile.firstName userProfile.lastName");

    // Return: 1. address from houseSchema
    // 2. A list of users that has same house with current user
    res.status(200).json({
      houseAddress: house.address,
      roommates: roommates.map((roommate) => ({
        firstName: roommate.userProfile.firstName,
        lastName: roommate.userProfile.lastName,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user's house and roommates",
      error: error.message,
    });
  }
};
