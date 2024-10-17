const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the ContactInfo Schema as a subdocument
const contactInfoSchema = new Schema({
  currentAddress: {
    apt: {
      type: String,
      default: "",
    },
    strName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  cell: {
    type: String,
  },
  work: {
    type: String,
  },
});

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
  contactInfo: contactInfoSchema,
});

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
  userProfile: userProfileSchema,
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
  emergencyContact: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
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
