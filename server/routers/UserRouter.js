const express = require("express");
const {
    fetchUserData,
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

    .get("/info", accessValidation, isEmployee, fetchUserData) // todo: add access middleware
    .put("/update", accessValidation, isEmployee, updateUserData); // todo: add access middleware

    


module.exports = UserRouter;
