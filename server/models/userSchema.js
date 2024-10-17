const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const driverLicenseSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

const employmentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["GC", "Citizen", "Visa"],
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    default: null,
  },
});

const ContactSchema = new Schema({
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
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  relationship: {
    type: String,
    required: true,
  },
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
  driverLicense: driverLicenseSchema,
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
  employment: employmentSchema,
  reference: ContactSchema,
  emergencyContact: ContactSchema,
  cellPhone: {
    type: String,
  },
  workPhone: {
    type: String,
  },
  nextStep: {
    type: String,
  },
  citizenshipStatus: {
    type: String,
    required: true,
    enum: ["Citizen", "Green Card", "Non-citizen"],
  },
});

module.exports = mongoose.model("User", userSchema);
