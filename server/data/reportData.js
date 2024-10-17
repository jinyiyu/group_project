const mongoose = require("mongoose");

const seedReports = [
  {
    title: "Quarterly Performance Review",
    desc: "A comprehensive review of the company's performance for Q3.",
    createdBy: new mongoose.Types.ObjectId("67115149e6a1b775d0f29945"), // Reference to User
    timestamp: "2024-10-15T12:00:00Z",
    status: "open",
    comments: [
      {
        desc: "Great analysis of the company's quarterly performance.",
        createdBy: new mongoose.Types.ObjectId("67115149e6a1b775d0f29945"), // Reference to User
        timestamp: "2024-10-15T14:00:00Z",
      },
    ],
  },
  {
    title: "Incident Report - Server Outage",
    desc: "A detailed report of the unexpected server outage on 10/12.",
    createdBy: new mongoose.Types.ObjectId("67115149e6a1b775d0f29945"), // Reference to User
    timestamp: "2024-10-13T09:30:00Z",
    status: "closed",
    comments: [
      {
        desc: "Great analysis of the company's quarterly performance.",
        createdBy: new mongoose.Types.ObjectId("67115149e6a1b775d0f29945"), // Reference to User
        timestamp: "2024-10-15T14:00:00Z",
      },
    ],
  },
];

module.exports = seedReports;
