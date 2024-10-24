// For fresh registered user/employee
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basicUserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userProfile: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "employee",
  },
  house: {
    type: Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
});

module.exports = mongoose.model("BasicUser", basicUserSchema);
