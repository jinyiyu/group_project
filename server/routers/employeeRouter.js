const express = require("express");
const {
  getProfile,
  getEmployeesPendingDocs,
  updateDocStatus,
  getVisaEmployees,
  getDownloadDocument,
} = require("../controllers/employeeController.js");

const employeeRouter = express.Router();

employeeRouter
  .get("/profile", getProfile)
  .get("/pending-docs", getEmployeesPendingDocs)
  .put("/update", updateDocStatus)
  .get("/visa-employees", getVisaEmployees)
  .get("/download-document", getDownloadDocument);

module.exports = employeeRouter;
