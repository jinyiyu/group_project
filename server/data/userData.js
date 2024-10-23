const mongoose = require("mongoose");

// Added 4 more users - Hieu Tran
const seedUsers = [
  {
    _id: "67147b5445846b9bac51d17f",
    userName: "john_doe",
    password: "securePassword123",
    role: "employee",
    onboardStatus: "pending",
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
    car: {
      model: "Honda Civic",
      color: "Red",
      make: "Honda",
    },
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
    car: {
      model: "Toyota Camry",
      color: "Blue",
      make: "Toyota",
    },
  },
  {
    userName: "alice_smith",
    password: "password789",
    role: "employee",
    onboardStatus: "not started",
    userProfile: {
      firstName: "Alice",
      lastName: "Smith",
      middleName: "L",
      preferredName: "Ally",
      email: "alice.smith@example.com",
      SSN: "567-89-0123",
      DoB: new Date("1985-08-15"),
      gender: "Female",
      profilePicture: "alice_picture.jpg",
    },
    address: {
      apt: "303",
      strName: "Elm St",
      city: "Sometown",
      state: "TX",
      zip: "54321",
    },
    contactInfo: {
      cellPhone: "654-321-9870",
      workPhone: "123-456-7890",
    },
    driverLicense: {
      number: "D543210987",
      expirationDate: new Date("2024-09-30"),
    },
    employment: {
      status: "GC",
      start: new Date("2019-03-10"),
      end: null,
    },
    emergencyContact: {
      firstName: "Robert",
      lastName: "Smith",
      middleName: "K",
      phone: "654-321-9876",
      email: "robert.smith@example.com",
      relationship: "Husband",
    },
    reference: {
      firstName: "Emily",
      lastName: "Davis",
      middleName: "C",
      phone: "123-654-7890",
      email: "emily.davis@example.com",
      relationship: "Friend",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Submit background check",
    cars: [
      {
        model: "Ford Focus",
        color: "White",
        make: "Ford",
      },
    ],
  },
  {
    userName: "michael_johnson",
    password: "password1010",
    role: "employee",
    onboardStatus: "Pending",
    userProfile: {
      firstName: "Michael",
      lastName: "Johnson",
      middleName: "P",
      preferredName: "Mike",
      email: "mike.johnson@example.com",
      SSN: "678-90-1234",
      DoB: new Date("1988-03-22"),
      gender: "Male",
      profilePicture: "mike_picture.jpg",
    },
    address: {
      apt: "404",
      strName: "Maple St",
      city: "Anyplace",
      state: "FL",
      zip: "67890",
    },
    contactInfo: {
      cellPhone: "789-012-3456",
      workPhone: "345-678-9012",
    },
    driverLicense: {
      number: "D678901234",
      expirationDate: new Date("2027-01-15"),
    },
    employment: {
      status: "Visa",
      start: new Date("2022-05-01"),
      end: new Date("2024-05-01"),
    },
    emergencyContact: {
      firstName: "Sarah",
      lastName: "Johnson",
      middleName: "M",
      phone: "789-012-3456",
      email: "sarah.johnson@example.com",
      relationship: "Wife",
    },
    reference: {
      firstName: "James",
      lastName: "Williams",
      middleName: "R",
      phone: "123-456-7890",
      email: "james.williams@example.com",
      relationship: "Colleague",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Submit visa documents",
    cars: [
      {
        model: "Chevrolet Malibu",
        color: "Black",
        make: "Chevrolet",
      },
    ],
  },
  {
    userName: "robert_williams",
    password: "securePass2020",
    role: "employee",
    onboardStatus: "approved",
    userProfile: {
      firstName: "Robert",
      lastName: "Williams",
      middleName: "N",
      preferredName: "Rob",
      email: "robert.williams@example.com",
      SSN: "111-22-3333",
      DoB: new Date("1987-06-15"),
      gender: "Male",
      profilePicture: "rob_picture.jpg",
    },
    address: {
      apt: "505",
      strName: "Pine St",
      city: "Anycity",
      state: "NV",
      zip: "56789",
    },
    contactInfo: {
      cellPhone: "333-444-5555",
      workPhone: "666-777-8888",
    },
    driverLicense: {
      number: "D111223333",
      expirationDate: new Date("2025-06-15"),
    },
    employment: {
      status: "GC",
      start: new Date("2015-08-01"),
      end: null,
    },
    emergencyContact: {
      firstName: "Emily",
      lastName: "Williams",
      middleName: "O",
      phone: "333-444-5556",
      email: "emily.williams@example.com",
      relationship: "Wife",
    },
    reference: {
      firstName: "John",
      lastName: "Brown",
      middleName: "S",
      phone: "444-555-6666",
      email: "john.brown@example.com",
      relationship: "Colleague",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Completed",
    cars: [
      {
        model: "Tesla Model S",
        color: "Blue",
        make: "Tesla",
      },
    ],
  },
  {
    userName: "emma_jones",
    password: "strongPass123",
    role: "employee",
    onboardStatus: "rejected",
    userProfile: {
      firstName: "Emma",
      lastName: "Jones",
      middleName: "K",
      preferredName: "Em",
      email: "emma.jones@example.com",
      SSN: "222-33-4444",
      DoB: new Date("1995-11-25"),
      gender: "Female",
      profilePicture: "emma_picture.jpg",
    },
    address: {
      apt: "606",
      strName: "Oak St",
      city: "Sometown",
      state: "NC",
      zip: "87654",
    },
    contactInfo: {
      cellPhone: "444-555-6666",
      workPhone: "777-888-9999",
    },
    driverLicense: {
      number: "D222334444",
      expirationDate: new Date("2024-12-15"),
    },
    employment: {
      status: "Citizen",
      start: new Date("2021-02-15"),
      end: null,
    },
    emergencyContact: {
      firstName: "Lucas",
      lastName: "Jones",
      middleName: "M",
      phone: "444-555-6667",
      email: "lucas.jones@example.com",
      relationship: "Brother",
    },
    reference: {
      firstName: "Anna",
      lastName: "Taylor",
      middleName: "P",
      phone: "555-666-7777",
      email: "anna.taylor@example.com",
      relationship: "Friend",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Submit new documents",
    cars: [
      {
        model: "Toyota Corolla",
        color: "Silver",
        make: "Toyota",
      },
    ],
  },
  {
    userName: "olivia_clark",
    password: "oliviaPass2021",
    role: "employee",
    onboardStatus: "approved",
    userProfile: {
      firstName: "Olivia",
      lastName: "Clark",
      middleName: "A",
      preferredName: "Liv",
      email: "olivia.clark@example.com",
      SSN: "333-44-5555",
      DoB: new Date("1993-05-05"),
      gender: "Female",
      profilePicture: "olivia_picture.jpg",
    },
    address: {
      apt: "707",
      strName: "Birch St",
      city: "Anycity",
      state: "MI",
      zip: "76543",
    },
    contactInfo: {
      cellPhone: "555-666-7777",
      workPhone: "888-999-0000",
    },
    driverLicense: {
      number: "D333445555",
      expirationDate: new Date("2026-05-05"),
    },
    employment: {
      status: "Citizen",
      start: new Date("2017-01-10"),
      end: null,
    },
    emergencyContact: {
      firstName: "David",
      lastName: "Clark",
      middleName: "B",
      phone: "555-666-7778",
      email: "david.clark@example.com",
      relationship: "Father",
    },
    reference: {
      firstName: "Sophia",
      lastName: "Miller",
      middleName: "Q",
      phone: "666-777-8888",
      email: "sophia.miller@example.com",
      relationship: "Colleague",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Completed",
    cars: [
      {
        model: "Honda Accord",
        color: "Black",
        make: "Honda",
      },
    ],
  },
  {
    userName: "liam_smith",
    password: "strongPassword321",
    role: "employee",
    onboardStatus: "pending",
    userProfile: {
      firstName: "Liam",
      lastName: "Smith",
      middleName: "J",
      preferredName: "Liam",
      email: "liam.smith@example.com",
      SSN: "444-55-6666",
      DoB: new Date("1991-12-30"),
      gender: "Male",
      profilePicture: "liam_picture.jpg",
    },
    address: {
      apt: "808",
      strName: "Cedar St",
      city: "Someplace",
      state: "IL",
      zip: "65432",
    },
    contactInfo: {
      cellPhone: "666-777-8888",
      workPhone: "999-000-1111",
    },
    driverLicense: {
      number: "D444556666",
      expirationDate: new Date("2025-12-30"),
    },
    employment: {
      status: "GC",
      start: new Date("2020-06-20"),
      end: null,
    },
    emergencyContact: {
      firstName: "Sarah",
      lastName: "Smith",
      middleName: "H",
      phone: "666-777-8889",
      email: "sarah.smith@example.com",
      relationship: "Sister",
    },
    reference: {
      firstName: "Emily",
      lastName: "Jones",
      middleName: "T",
      phone: "777-888-9999",
      email: "emily.jones@example.com",
      relationship: "Friend",
    },
    house: new mongoose.Types.ObjectId(),
    feedback: [],
    nextStep: "Submit documents",
    cars: [
      {
        model: "Ford Escape",
        color: "Green",
        make: "Ford",
      },
    ],
  },
];

module.exports = seedUsers;
