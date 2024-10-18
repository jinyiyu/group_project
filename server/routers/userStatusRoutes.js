const router = require("express").Router();
const userStatusController = require("../controllers/userStatusController");

router.get("/status", userStatusController.getVisaStatus);

module.exports = router;
