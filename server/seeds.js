const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userSchema");
const Document = require("./models/documentSchema");
const Report = require("./models/reportSchema");
const House = require("./models/houseSchema");

const seedUsers = require("./data/userData");
const seedDocument = require("./data/documentData");
const seedReports = require("./data/reportData");
const seedHouses = require("./data/houseData");

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
    await Report.deleteMany({});
    await House.deleteMany({});

    console.log("Existing data deleted successfully.");

    const createdHouses = await House.insertMany(seedHouses);

    // Assign house IDs to users (employees) - Hieu Tran
    seedUsers[0].house = createdHouses[0]._id;
    seedUsers[1].house = createdHouses[1]._id;

    const createdUsers = await User.insertMany(seedUsers);
    const userIds = createdUsers.map((user) => user._id);

    // Update seedDocument with actual user IDs - Hieu Tran edit
    const documentsWithUsers = seedDocument.map((document, index) => ({
      ...document,
      user: userIds[index % userIds.length],
    }));

    const reportsWithUsers = seedReports.map((report, index) => ({
      ...report,
      createdBy: userIds[index % userIds.length],
      comments: report.comments.map((comment, commentIndex) => ({
        ...comment,
        createdBy: userIds[(index + commentIndex) % userIds.length],
      })),
    }));

    const createdDocument = await Document.insertMany(documentsWithUsers);
    const createdReports = await Report.insertMany(reportsWithUsers);

    console.log("Users seeded successfully");
    console.log("Document seeded successfully");
    console.log("Reports seeded successfully.");
    console.log("Houses seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

start();
