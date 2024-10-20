const router = require("express").Router();
const hrHousingController = require("../controllers/hrHousingController");

router.get("/", hrHousingController.getAllHouses);
router.post("/", hrHousingController.addHouse);
router.get("/:houseId", hrHousingController.getHouseDetail);
router.post(
  "/reports/:reportId/comments",
  hrHousingController.addCommentToFacilityReport
);
router.put(
  "/reports/:reportId/comments/:commentId",
  hrHousingController.updateCommentToFacilityReport
);
router.get("/:houseId/employees", hrHousingController.getEmployees);

module.exports = router;
