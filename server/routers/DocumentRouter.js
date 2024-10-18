const express = require("express");
const {updateFile, fetchFileUrls} = require("../controllers/DocumentController.js")

const DocumentRouter = express.Router();

DocumentRouter
  .put("/upload", updateFile)
  .get("/fetchUrls", fetchFileUrls);
;

module.exports = DocumentRouter;