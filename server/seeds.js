const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userSchema");
const seedUsers = require("./data/userData");
const EmergContact = require("./models/emergContactSchema");
const seedEmergContacts = require("./data/emergContactData");

const start = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
  } finally {
    mongoose.connection.close();
  }
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});

    await EmergContact.deleteMany({});
    console.log("Existing data deleted successfully.");

    const createdUsers = await User.insertMany(seedUsers);
    console.log("Users seeded successfully");

    const createdEmergContacts = await EmergContact.insertMany(
      seedEmergContacts
    );
    console.log("Emergency contacts seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

start();
