// my modified seedDocument - Hieu Tran
const seedDocument = [
  {
    user: "671abce1ac955752214414af",
    documentType: "OPT_receipt",
    fileUrl: "/uploads/user_id_124_opt-receipt.pdf",
    status: "Approved",
    feedback: "Your employer has been contacted and verified.",
    uploadedAt: "2024-07-20T11:23:45.311Z",
  },
  {
    user: "671abce1ac955752214414af",
    documentType: "OPT_EAD",
    fileUrl:
      "https://bfgp.s3.amazonaws.com/671abce1ac955752214414af/OPT_EAD.png",
    status: "Approved",
    feedback: "Your employer has been contacted and verified.",
    uploadedAt: "2024-08-17T09:34:32.042Z",
  },

  {
    user: "671abce1ac955752214414af",
    documentType: "I_983",
    fileUrl: "https://bfgp.s3.amazonaws.com/671abce1ac955752214414af/I_983.png",
    status: "Approved",
    feedback: "Your employer has been contacted and verified.",
    uploadedAt: "2024-09-10T14:56:12.123Z",
  },
  {
    user: "671abce1ac955752214414af",
    documentType: "I_20",
    fileUrl: "https://bfgp.s3.amazonaws.com/671abce1ac955752214414af/I_20.png",
    status: "Pending",
    feedback: "Waiting for your employer's verification.",
    uploadedAt: "2024-10-20T17:12:02.789Z",
  },
];

module.exports = seedDocument;
