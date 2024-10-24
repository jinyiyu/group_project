const router = require("express").Router();
const userHouseController = require("../controllers/userHouseController");
const { accessValidation } = require("../middlewares/AuthMiddleWare");
router.get("/housing", accessValidation, userHouseController.getHouseDetail);

module.exports = router;
