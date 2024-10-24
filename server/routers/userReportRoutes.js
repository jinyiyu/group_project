const router = require("express").Router();
const userReportController = require("../controllers/userReportController");
const { accessValidation } = require("../middlewares/AuthMiddleWare");

router.post("/reports", accessValidation, userReportController.createReport);
router.get("/reports", accessValidation, userReportController.getUserReports);
router.post(
  "/:reportId/comments",
  accessValidation,
  userReportController.addComment
);
router.put(
  "/:reportId/comments/:commentId",
  accessValidation,
  userReportController.updateComment
);

module.exports = router;
