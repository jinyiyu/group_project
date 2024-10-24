const express = require("express");
const {updateFile, fetchFileUrls} = require("../controllers/DocumentController.js")
const multer = require('multer');
const upload = multer();
const {
  accessValidation,
    isEmployee,
} = require("../middlewares/AuthMiddleWare.js");
const DocumentRouter = express.Router();

DocumentRouter
  .put("/upload", accessValidation, isEmployee, updateFile)
  .get("/fetchUrls", accessValidation, isEmployee, fetchFileUrls);
;

module.exports = DocumentRouter;