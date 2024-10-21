const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ["OPT_receipt", "OPT_EAD", "I_983", "I_20"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  daysRemaining: {
    type: Number,
    // required: function () {
    //   return this.documentType === "OPT_EAD";
    // },
    default: undefined,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  feedback: {
    type: String,
    required: function () {
      return this.status === "Rejected";
    },
    default: undefined,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
