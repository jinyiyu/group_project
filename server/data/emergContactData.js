const mongoose = require("mongoose");

const seedEmergencyContacts = [
  {
    firstName: "John",
    lastName: "Doe",
    middleName: "A",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    relationship: "Brother",
    userId: new mongoose.Types.ObjectId(),
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    middleName: "B",
    phone: "098-765-4321",
    email: "jane.doe@example.com",
    relationship: "Sister",
    userId: new mongoose.Types.ObjectId(),
  },
];

module.exports = seedEmergencyContacts;
