const User = require("../models/userSchema");

// Get all employees' profiles
const getProfile = async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        "userProfile.firstName": 1,
        "userProfile.lastName": 1,
        "userProfile.preferredName": 1,
        "userProfile.email": 1,
        SSN: 1,
        "employment.status": 1,
        "contactInfo.cellPhone": 1,
      }
    );

    const profiles = users.map((user) => ({
      name: {
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        preferredName: user.userProfile.preferredName,
      },
      SSN: user.SSN,
      "Work Authorization Title": user.employment.status,
      "Phone Number": user.contactInfo.cellPhone,
      Email: user.userProfile.email,
    }));

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving employee profiles" });
  }
};

// Search employees' profiles by query
const searchEmployees = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const users = await User.find(
      {
        $or: [
          { "userProfile.firstName": { $regex: query, $options: "i" } },
          { "userProfile.lastName": { $regex: query, $options: "i" } },
          { "userProfile.preferredName": { $regex: query, $options: "i" } },
        ],
      },
      {
        "userProfile.firstName": 1,
        "userProfile.lastName": 1,
        "userProfile.preferredName": 1,
        "userProfile.email": 1,
        SSN: 1,
        "employment.status": 1,
        "contactInfo.cellPhone": 1,
      }
    );

    const profiles = users.map((user) => ({
      name: {
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        preferredName: user.userProfile.preferredName,
      },
      SSN: user.SSN,
      "Work Authorization Title": user.employment.status,
      "Phone Number": user.contactInfo.cellPhone,
      Email: user.userProfile.email,
    }));

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error searching employee profiles" });
  }
};

module.exports = { getProfile, searchEmployees };
