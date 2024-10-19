const router = require("express").Router();
const userHouseController = require("../controllers/userHouseController");

router.get("/housing", userHouseController.getHouseDetail);

module.exports = router;
