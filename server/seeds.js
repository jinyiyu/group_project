const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userSchema");
const seedUsers = require("./data/userData");
const seedDocument = require("./data/documentData");
const Document = require("./models/documentSchema");

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
    await Document.deleteMany({});
    console.log("Existing data deleted successfully.");

    const createdUsers = await User.insertMany(seedUsers);
    const createdDocument = await Document.insertMany(seedDocument);
    console.log("Users seeded successfully");
    console.log("Document seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

start();
