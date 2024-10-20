const router = require("express").Router();
const userStatusController = require("../controllers/userStatusController");

router.get("/status", userStatusController.getVisaStatus);
router.put("/upload", userStatusController.uploadDocument);
router.get("/download/:templateType", userStatusController.downloadTemplate);

module.exports = router;
