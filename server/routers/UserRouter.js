const express = require("express");
const {fetchUserData, updateUserData} = require("../controllers/UserController.js")
const UserRouter = express.Router();

UserRouter
  .get("/info", fetchUserData)
  .put("/update", updateUserData);
;

module.exports = UserRouter;