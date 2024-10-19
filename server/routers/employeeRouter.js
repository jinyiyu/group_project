const express = require("express");
const {
  getProfile,
  searchEmployees,
} = require("../controllers/employeeController.js");

const employeeRouter = express.Router();

employeeRouter.get("/profile", getProfile).get("/search", searchEmployees);
module.exports = employeeRouter;
