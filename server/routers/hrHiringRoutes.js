const router = require("express").Router();
const hrHiringController = require("../controllers/hrHiringController");

router.post("/token", hrHiringController.generateRegToken);
router.get("/token", hrHiringController.getTokenHistory);
router.get("/applications", hrHiringController.getOnboardingApplication);
router.get(
  "/applications/:userId",
  hrHiringController.getIndividualApplication
);
router.put("/applications/:userId", hrHiringController.updateApplicationStatus);
router.put("/applications/:userId/feedback", hrHiringController.giveFeedback);

module.exports = router;
