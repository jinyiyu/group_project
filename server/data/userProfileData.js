const seedUserProfiles = [
  {
    firstName: "John",
    lastName: "Doe",
    middleName: "A",
    preferredName: "Johnny",
    email: "john.doe@example.com",
    SSN: "123-45-6789",
    DoB: new Date("1990-01-01"),
    gender: "Male",
    profilePicture: "john_profile.jpg",
    citizenshipStatus: "Citizen",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    middleName: "B",
    preferredName: "Janey",
    email: "jane.smith@example.com",
    SSN: "987-65-4321",
    DoB: new Date("1992-05-15"),
    gender: "Female",
    profilePicture: "jane_profile.jpg",
    citizenshipStatus: "Green Card",
  },
];

module.exports = seedUserProfiles;
