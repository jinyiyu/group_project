const express = require("express");
const {updateFile, fetchFileUrls} = require("../controllers/DocumentController.js")
const multer = require('multer');
const upload = multer();

const DocumentRouter = express.Router();

DocumentRouter
  .put("/upload", updateFile)
  .get("/fetchUrls", fetchFileUrls);
;

module.exports = DocumentRouter;