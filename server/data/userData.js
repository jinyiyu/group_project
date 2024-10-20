const mongoose = require("mongoose");

const seedUsers = [
  {
    userName: "john_doe",
    password: "securePassword123",
    role: "employee",
    onboardStatus: "not started",
    userProfile: {
      firstName: "John",
      lastName: "Doe",
      middleName: "A",
      preferredName: "Johnny",
      email: "john.doe@example.com",
      SSN: "123-45-6789",
      DoB: new Date("1990-01-01"),
      gender: "Male",
      profilePicture: "john_picture.jpg",
    },
    address: {
      apt: "101",
      strName: "Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
    contactInfo: {
      cellPhone: "123-456-7890",
      workPhone: "098-765-4321",
    },
    driverLicense: {
      number: "D123456789",
      expirationDate: new Date("2026-01-31"),
    },
    employment: {
      status: "OPT",
      start: new Date("2020-06-01"),
      end: new Date("2028-06-01"),
    },
    emergencyContact: {
      firstName: "John",
      lastName: "Doe",
      middleName: "A",
      phone: "123-456-7890",
      email: "john.dower@example.com",
      relationship: "Brother",
    },
    reference: {
      firstName: "Jane",
      lastName: "Doe",
      middleName: "B",
      phone: "098-765-4321",
      email: "jane.do8@example.com",
      relationship: "Sister",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Awaiting documents",
    cars: [
      {
        model: "Honda Civic",
        color: "Red",
        make: "Honda",
      },
    ],
  },
  {
    userName: "jane_doe",
    password: "securePassword456",
    role: "employee",
    onboardStatus: "not started",
    userProfile: {
      firstName: "Jane",
      lastName: "Doe",
      middleName: "B",
      preferredName: "Janie",
      email: "jane.doe3@example.com",
      SSN: "987-65-4321",
      DoB: new Date("1992-02-02"),
      gender: "Female",
      profilePicture: "jane_picture.jpg",
    },
    address: {
      apt: "202",
      strName: "Second St",
      city: "Othertown",
      state: "NY",
      zip: "67890",
    },
    contactInfo: {
      cellPhone: "321-654-0987",
      workPhone: "789-012-3456",
    },
    driverLicense: {
      number: "D987654321",
      expirationDate: new Date("2025-12-15"),
    },
    employment: {
      status: "Citizen",
      start: new Date("2018-01-15"),
      end: null,
    },
    emergencyContact: {
      firstName: "Jane",
      lastName: "Doe",
      middleName: "B",
      phone: "098-765-4321",
      email: "jane.doe@example.com",
      relationship: "Sister",
    },
    reference: {
      firstName: "Jane",
      lastName: "Doe",
      middleName: "B",
      phone: "098-765-4321",
      email: "jane.do6@example.com",
      relationship: "Sister",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Awaiting documents",
    cars: [
      {
        model: "Toyota Camry",
        color: "Blue",
        make: "Toyota",
      },
    ],
  },
];

module.exports = seedUsers;
