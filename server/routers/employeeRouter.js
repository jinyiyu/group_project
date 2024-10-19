const express = require("express");
const {
  getProfile,
  searchEmployees,
  getEmployeesPendingDoc,
  updateDocStatus,
  getVisaEmployees,
} = require("../controllers/employeeController.js");

const employeeRouter = express.Router();

employeeRouter
  .get("/profile", getProfile)
  .get("/search", searchEmployees)
  .get("/pending-docs", getEmployeesPendingDoc)
  .post("/update-doc-status", updateDocStatus)
  .get("/visa-employees", getVisaEmployees);

module.exports = employeeRouter;
