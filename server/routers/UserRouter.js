const express = require("express");
const {
  fetchUserData,
  fetchUserDataById,
  updateUserData,
} = require("../controllers/UserController.js");
const {
  inviteUrlValidation,
  accessValidation,
    isEmployee,
} = require("../middlewares/AuthMiddleWare.js");
const {
  passwordValidation,
  fieldsValidation,
} = require("../middlewares/UserMiddleWare.js");
const {
  register,
  login,
  validRegisterURL,
  logout,
  isLoggedIn,
  getUsers,
} = require("../controllers/UserController.js");
const UserRouter = express.Router();

UserRouter.get(
  "/validateRegister/:token",
  inviteUrlValidation,
  validRegisterURL
)
  .post(
    "/register/:token",
    inviteUrlValidation,
    fieldsValidation,
    passwordValidation,
    register
  )
  .post("/login", login)

  .get("/isLoggedIn", accessValidation, isLoggedIn)
  .get("/logout", accessValidation, logout)
  .get("/basicUsers", getUsers)
  .get("/info/:id", fetchUserDataById)
  .get("/info", fetchUserData) // todo: add access middleware
  .put("/update", updateUserData); // todo: add access middleware

module.exports = UserRouter;
