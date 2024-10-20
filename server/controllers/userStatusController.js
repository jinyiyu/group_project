const User = require("../models/userSchema");
const Doc = require("../models/documentSchema");

// Take in a userId, return user's visa status
exports.getVisaStatus = async (req, res) => {
  try {
    const userId = req.cookies.user_id;

    // Get one newest uploaded document from documentSchema by userId,
    // and make sure only counting for documentType: "OPT receipt", "OPT EAD", "I-983", "I-20"
    const latestDocument = await Doc.findOne({
      user: userId,
      documentType: { $in: ["OPT-receipt", "OPT-EAD", "I-983", "I-20"] },
    })
      .sort({ uploadedAt: -1 })
      .limit(1);

    if (!latestDocument) {
      return res
        .status(404)
        .json({ message: "No OPT-related documents found" });
    }

    // Return 1. documentType,
    // 2. status
    // 3. feedback
    res.status(200).json({
      documentType: latestDocument.documentType,
      status: latestDocument.status,
      feedback: latestDocument.feedback,
    });
  } catch (error) {
    res.status(500),
      json({ message: "Fail to get user's visa status", error: error.message });
  }
};
