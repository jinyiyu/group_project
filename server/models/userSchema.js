const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User Schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  role: {
    type: String,
    default: "employee",
  },
  onboardStatus: {
    type: String,
    default: "not started",
  },
  driverLicense: {
    type: Schema.Types.ObjectId,
    ref: "DriverLicense",
  },
  house: {
    type: Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  feedback: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  employment: {
    type: Schema.Types.ObjectId,
    ref: "Employment",
  },
  reference: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
  },
  emergency: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
  addr: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  cellPhone: {
    type: String,
  },
  workPhone: {
    type: String,
  },
  nextStep: {
    type: String,
  },
  document: [
    {
      type: Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  citizenshipStatus: {
    type: String,
    required: true,
    enum: ["Citizen", "Green Card", "Non-citizen"],
  },
});

module.exports = mongoose.model("User", userSchema);
