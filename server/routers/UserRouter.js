const express = require("express");
const {
    fetchUserData,
    updateUserData,
} = require("../controllers/UserController.js");
const {
    inviteUrlValidation,
    accessValidation,
} = require("../middlewares/AuthMiddleWare.js");
const {
    passwordValidation,
    fieldsValidation,
} = require("../middlewares/UserMiddleWare.js");
const {
    register,
    login,
    validRegisterURL,
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

    .get("/info", fetchUserData) // todo: add access middleware
    .put("/update", updateUserData); // todo: add access middleware

module.exports = UserRouter;
