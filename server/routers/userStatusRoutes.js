const router = require("express").Router();
const userStatusController = require("../controllers/userStatusController");
const { accessValidation } = require("../middlewares/AuthMiddleWare");

router.get("/status", accessValidation, userStatusController.getVisaStatus);
router.put("/upload", accessValidation, userStatusController.uploadDocument);
router.get("/download/:templateType", userStatusController.downloadTemplate);

module.exports = router;
