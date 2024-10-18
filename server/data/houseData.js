const seedHouses = [
  {
    address: "123 Maple Street",
    numOfResidents: 3,
    landlord: {
      name: "John Doe",
      phone: "555-1234",
      email: "john.doe@example.com",
    },
    facilityInfo: {
      bed: 3,
      mattresse: 3,
      table: 2,
      chair: 4,
      addr: "123 Maple Street",
    },
  },
  {
    address: "456 Oak Avenue",
    numOfResidents: 4,
    landlord: {
      name: "Jane Smith",
      phone: "555-5678",
      email: "jane.smith@example.com",
    },

    facilityInfo: {
      bed: 4,
      mattresse: 4,
      table: 3,
      chair: 5,
      addr: "456 Oak Avenue",
    },
  },
];

module.exports = seedHouses;
