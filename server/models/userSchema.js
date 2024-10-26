// Hieu Tran - modified userSchema to use empty string for required fields, set new Date() for Date type
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Profile Schema
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
    default: "",
  },
  preferredName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  SSN: {
    type: String,
    default: "",
  },
  DoB: {
    type: Date,
    default: new Date(),
  },
  gender: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
});

// Address Schema
const addressSchema = new Schema({
  apt: {
    type: String,
    default: "",
  },
  strName: {
    type: String,
    default: "",
    required: true,
  },
  city: {
    type: String,
    default: "",
    required: true,
  },
  state: {
    type: String,
    default: "",
    required: true,
  },
  zip: {
    type: String,
    default: "",
    required: true,
  },
});

// Contact Info Schema
const contactInfoSchema = new Schema({
  cellPhone: {
    type: String,
    default: "",
  },
  workPhone: {
    type: String,
    default: "",
  },
});

// Driver License Schema
const driverLicenseSchema = new mongoose.Schema({
  licenseCopy: {
    type: String,
    default: "",
  },
  number: {
    type: String,
    default: "",
    // required: true,
  },
  expirationDate: {
    type: Date,
    default: null,
  },
});

// Employment Schema
const employmentSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const enumValues = [
          "GC",
          "Citizen",
          "H1B",
          "L2",
          "F1(CPT/OPT)",
          "H4",
          "other",
        ];
        return enumValues.includes(value) || typeof value === "string";
      },
      message: (props) => `${props.value} is not a valid status!`,
    },
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    default: new Date(),
  },
});

// Emergency Contact & Reference Schema
const ContactSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  middleName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  relationship: {
    type: String,
    default: "",
  },
});

// Car Schema
const carSchema = new mongoose.Schema({
  model: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  make: {
    type: String,
    default: "",
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
  role: {
    type: String,
    default: "employee",
  },
  userProfile: userProfileSchema,
  address: addressSchema,
  contactInfo: contactInfoSchema,
  employment: employmentSchema,
  emergencyContact: {
    type: [ContactSchema],
    default: [],
  },
  reference: {
    type: ContactSchema,
    default: {},
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
  feedback: {
    type: [String],
    default: [],
  },
  nextStep: {
    type: String,
    default: "",
  },
  car: carSchema,
});

module.exports = mongoose.model("User", userSchema);
