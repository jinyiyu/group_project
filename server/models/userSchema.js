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
});

const addressSchema = new Schema({
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
});

const contactInfoSchema = new Schema({
  cellPhone: {
    type: String,
  },
  workPhone: {
    type: String,
  },
});

const driverLicenseSchema = new mongoose.Schema({
  licenseCopy: {
    type: String,
    default: "placeholder.jpg",
  },
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

const carSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  make: {
    type: String,
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
  emergencyContact: [ContactSchema],
  reference: ContactSchema,
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
  nextStep: {
    type: String,
  },
  car: carSchema,
});

module.exports = mongoose.model("User", userSchema);
