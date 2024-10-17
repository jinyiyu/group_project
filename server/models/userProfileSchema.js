const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  preferredName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  SSN: {
    type: String,
  },
  DoB: {
    type: Date,
  },
  gender: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: "placeholder.jpg",
  },
  citizenshipStatus: {
    type: String,
    required: true,
    enum: ["Citizen", "Green Card", "Non-citizen"],
  },
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
