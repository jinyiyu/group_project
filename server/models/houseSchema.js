const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const facilityInfoSchema = new mongoose.Schema({
  bed: {
    type: Number,
    required: true,
  },
  mattresse: {
    type: Number,
    required: true,
  },
  table: {
    type: Number,
    required: true,
  },
  chair: {
    type: Number,
    required: true,
  },
  addr: {
    type: String,
    required: true,
  },
});

const houseSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  numOfResidents: {
    type: Number,
    required: true,
  },
  landlord: {
    type: landlordSchema,
  },
  facilityInfo: {
    type: facilityInfoSchema,
  },
});

const House = mongoose.model("House", houseSchema);

module.exports = House;
