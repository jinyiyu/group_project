const mongoose = require("mongoose");
const User = require("./models/userSchema");
const seedUsers = require("./data/userData");
const UserProfile = require("./models/userProfileSchema");
const seedUserProfiles = require("./data/userProfileData");
const connectDB = require("./config/db");

const start = async () => {
  try {
    connectDB();
    await seedDatabase();
  } catch (err) {
  } finally {
    mongoose.connection.close();
  }
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});

    const createdUsers = await User.insertMany(seedUsers);
    console.log("Users seeded successfully");
    const createdUserProfiles = await UserProfile.insertMany(seedUserProfiles);
    console.log("Users Profile seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

start();
