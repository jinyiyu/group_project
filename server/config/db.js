const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const DB_NAME = process.env.DB_NAME;
    const MONGO_URI =
      process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;

    if (!DB_NAME) {
      throw new Error("DB_NAME is not defined in environment variables.");
    }

    await mongoose.connect(MONGO_URI);
    console.log(
      `[INFO]: Successfully connected to database | ${process.env.DB_NAME}`
    );
  } catch (err) {
    console.error(`[ERROR]: Failed to connect to database | ${err.message}`);
    throw new Error("Failed to connect to database");
  }
};

module.exports = connectDB;
