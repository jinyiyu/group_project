const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenHistorySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  registrationLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "registered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3 * 60 * 60, // Automatically deletes after 3 hours
  },
});

module.exports = mongoose.model("TokenHistory", tokenHistorySchema);
