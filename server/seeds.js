const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userSchema");
const Document = require("./models/documentSchema");
const { Report, Comment } = require("./models/reportSchema");
const House = require("./models/houseSchema");
const tokenHistory = require("./models/tokenHistorySchema");
const basicUser = require("./models/basicUserSchema");

const argon2 = require("argon2");

const seedUsers = require("./data/userData");
const seedDocument = require("./data/documentData");
const seedReports = require("./data/reportData");
const seedHouses = require("./data/houseData");

const hashPasswords = async (users) => {
  return Promise.all(
    users.map(async (user) => {
      const hashedPassword = await argon2.hash(user.password);
      return { ...user, password: hashedPassword };
    })
  );
};

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
    await tokenHistory.deleteMany({});
    await basicUser.deleteMany({});

    console.log("Existing data deleted successfully.");

    const createdHouses = await House.insertMany(seedHouses);

    // Assign house IDs to users (employees) - Hieu Tran
    seedUsers[0].house = createdHouses[0]._id;
    seedUsers[1].house = createdHouses[1]._id;
    seedUsers[2].house = createdHouses[0]._id;
    seedUsers[3].house = createdHouses[1]._id;

    const usersWithHashedPasswords = await hashPasswords(seedUsers);

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
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
