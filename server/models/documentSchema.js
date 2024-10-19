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
    enum: ["OPT receipt", "OPT EAD", "I-983", "I-20", "carLicense"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  daysRemaining: {
    type: Number,
    required: function () {
      return this.documentType === "OPT EAD";
    },
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
