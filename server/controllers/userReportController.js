const { Report } = require("../models/reportSchema");

// Create a report that points to current user by userId
// Request: {title, desc}, Response: {message, report object}
exports.createReport = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userId = req.body.user.id;

    // Create a new Report
    const newReport = new Report({
      title,
      desc,
      createdBy: userId,
    });

    await newReport.save();

    // Return a response with a message and a report
    res.status(201).json({
      message: "Report created successfuly",
      report: newReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create report", error: error.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const userReports = await Report.find({ createdBy: userId }).populate({
      path: "comments",
      populate: {
        path: "createdBy",
        select: "userName",
      },
    });

    if (userReports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }

    res.status(200).json(userReports);
  } catch (error) {
    res.status(500).json({
      message: "Fail finding report for current user",
      error: error.message,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const { reportId } = req.params;
    const { desc } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in cookies" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const newComment = {
      desc,
      createdBy: userId,
    };

    report.comments.push(newComment);
    await report.save();

    // Populate the createdBy field for the comments
    const updatedReport = await Report.findById(reportId)
      .populate("comments.createdBy", "userName") // Populate the userName field from createdBy
      .exec();

    res.status(200).json({ message: "Comment saved", report: updatedReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Take reportId and commentId from request params
// Put updated comment by the commentId and update the timestamp
exports.updateComment = async (req, res) => {
  try {
    const { reportId, commentId } = req.params;
    const { desc } = req.body;
    const userId = req.body.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    comment.desc = desc;
    comment.timestamp = Date.now();

    await report.save();

    // Populate the createdBy field for the comments
    const updatedReport = await Report.findById(reportId)
      .populate("comments.createdBy", "userName") // Populate the userName field from createdBy
      .exec();

    res
      .status(200)
      .json({ message: "Comment updated successfully", report: updatedReport });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update comment", error: error.message });
  }
};
