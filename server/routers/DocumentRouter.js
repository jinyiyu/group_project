const express = require("express");
const {updateFile} = require("../controllers/DocumentController.js")

const DocumentRouter = express.Router();

DocumentRouter
  .put("/upload", updateFile);
;

module.exports = DocumentRouter;