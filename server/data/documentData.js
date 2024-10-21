// const seedDocument = [
//   {
//     user: "644191c7ed47a8c70b158fdc",
//     documentType: "OPT_EAD",
//     fileUrl: "/uploads/user_id_123.pdf",
//     status: "Rejected",
//     feedback: "The document is expired.",
//     uploadedAt: "2024-10-17T09:34:32.042Z",
//   },
// ];

// my modified seedDocument for testing - Hieu Tran
const seedDocument = [
  {
    user: "671550ed03a1c5e695124275",
    documentType: "OPT_EAD",
    fileUrl: "/uploads/user_id_123_opt-ead.pdf",
    status: "Approved",
    feedback: "The document is expired.",
    uploadedAt: "2024-10-17T09:34:32.042Z",
  },
  {
    user: "671550ed03a1c5e695124275",
    documentType: "OPT_receipt",
    fileUrl: "/uploads/user_id_124_opt-receipt.pdf",
    status: "Approved",
    feedback: "Document is valid and complete.",
    uploadedAt: "2024-09-20T11:23:45.311Z",
  },
  {
    user: "671550ed03a1c5e695124275",
    documentType: "I_983",
    fileUrl: "/uploads/user_id_125_i-983.pdf",
    status: "Pending",
    feedback: "Awaiting review by the HR department.",
    uploadedAt: "2024-10-10T14:56:12.123Z",
  },
  {
    user: "671550ed03a1c5e695124275",
    documentType: "I_20",
    fileUrl: "/uploads/user_id_126_i-20.pdf",
    status: "Rejected",
    feedback: "Incorrect dates provided on the document.",
    uploadedAt: "2024-09-28T17:12:02.789Z",
  },
  {
    user: "671550ed03a1c5e695124275",
    documentType: "OPT_EAD",
    fileUrl: "/uploads/user_id_127_opt-ead.pdf",
    status: "Pending",
    feedback: "Document is under review.",
    uploadedAt: "2024-10-05T08:44:51.021Z",
  },
];

module.exports = seedDocument;
