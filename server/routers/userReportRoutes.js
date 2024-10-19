const router = require("express").Router();
const userReportController = require("../controllers/userReportController");

router.post("/reports", userReportController.createReport);
router.get("/reports", userReportController.getUserReports);
router.post("/:reportId/comments", userReportController.addComment);
router.put(
  "/:reportId/comments/:commentId",
  userReportController.updateComment
);

module.exports = router;
