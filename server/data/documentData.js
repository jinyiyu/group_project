// const seedDocument = [
//   {
//     user: "644191c7ed47a8c70b158fdc",
//     documentType: "OPT EAD",
//     fileUrl: "/uploads/user_id_123.pdf",
//     status: "Rejected",
//     feedback: "The document is expired.",
//     uploadedAt: "2024-10-17T09:34:32.042Z",
//   },
// ];

// my modified seedDocument - Hieu Tran
const seedDocument = [
  {
    documentType: "OPT EAD",
    fileUrl: "/uploads/user_id_123.pdf",
    status: "Rejected",
    daysRemaining: 0,
    feedback: "The document is expired.",
    uploadedAt: "2024-10-17T09:34:32.042Z",
  },
  {
    documentType: "I-20",
    fileUrl: "/uploads/user_id_124.pdf",
    status: "Approved",
    daysRemaining: 365,
    feedback: "Valid document, no issues.",
    uploadedAt: "2024-09-30T08:00:00.000Z",
  },
  {
    documentType: "carLicense",
    fileUrl: "/uploads/user_id_125.pdf",
    status: "Pending",
    daysRemaining: 180,
    feedback: "Awaiting verification from the DMV.",
    uploadedAt: "2024-09-25T10:45:00.000Z",
  },
  {
    documentType: "I-983",
    fileUrl: "/uploads/user_id_126.pdf",
    status: "Approved",
    daysRemaining: 730,
    feedback: "Document verified.",
    uploadedAt: "2024-09-20T12:20:00.000Z",
  },
  {
    documentType: "OPT EAD",
    fileUrl: "/uploads/user_id_127.pdf",
    status: "Pending",
    daysRemaining: 90,
    feedback: "Document is under review.",
    uploadedAt: "2024-09-15T14:00:00.000Z",
  },
  {
    documentType: "I-20",
    fileUrl: "/uploads/user_id_128.pdf",
    status: "Rejected",
    daysRemaining: 0,
    feedback: "Document was not properly signed.",
    uploadedAt: "2024-08-10T16:30:00.000Z",
  },
  {
    documentType: "carLicense",
    fileUrl: "/uploads/user_id_129.pdf",
    status: "Approved",
    daysRemaining: 365,
    feedback: "License is valid until next renewal.",
    uploadedAt: "2024-07-22T09:15:00.000Z",
  },
  {
    documentType: "I-983",
    fileUrl: "/uploads/user_id_130.pdf",
    status: "Pending",
    daysRemaining: 60,
    feedback: "Pending employer's signature.",
    uploadedAt: "2024-08-05T11:00:00.000Z",
  },
];

module.exports = seedDocument;
