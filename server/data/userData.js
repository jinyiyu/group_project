const mongoose = require("mongoose");

const seedUsers = [
  {
    userName: "john_doe",
    password: "securePassword123",
    userProfile: new mongoose.Types.ObjectId(),
    role: "employee",
    onboardStatus: "not started",
    driverLicense: null,
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    employment: null,
    reference: null,
    emergency: [],
    addr: null,
    cellPhone: "123-456-7890",
    workPhone: "098-765-4321",
    nextStep: "Awaiting documents",
    document: [],
    citizenshipStatus: "Citizen",
  },
  {
    userName: "jane_doe",
    password: "securePassword456",
    userProfile: new mongoose.Types.ObjectId(),
    role: "employee",
    onboardStatus: "not started",
    driverLicense: null,
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    employment: null,
    reference: null,
    emergency: [],
    addr: null,
    cellPhone: "321-654-0987",
    workPhone: "789-012-3456",
    nextStep: "Awaiting documents",
    document: [],
    citizenshipStatus: "Green Card",
  },
];

module.exports = seedUsers;
