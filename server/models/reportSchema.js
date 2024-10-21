const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  comments: [commentSchema],
});

// module.exports = mongoose.model("Report", reportSchema);

// Exporting both models separately - Hieu Tran
const Report = mongoose.model("Report", reportSchema);
const Comment = mongoose.model("Comment", commentSchema);

// Export comment schema for application feedback use, comment for report is a different thing that's related to the housing report. - Hieu Tran
module.exports = {
  Report,
  Comment,
};
