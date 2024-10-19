const express = require("express");
const {
  getProfile,
  getEmployeesPendingDocs,
  updateDocStatus,
  getVisaEmployees,
} = require("../controllers/employeeController.js");

const employeeRouter = express.Router();

employeeRouter
  .get("/profile", getProfile)
  .get("/pending-docs", getEmployeesPendingDocs)
  .put("/update", updateDocStatus)
  .get("/visa-employees", getVisaEmployees);

module.exports = employeeRouter;
