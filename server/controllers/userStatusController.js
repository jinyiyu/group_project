const User = require("../models/userSchema");
const Doc = require("../models/documentSchema");
const { uploadFile, downloadFile } = require("../utils/aws-s3.js");
const baseUrl = "https://bfgp.s3.amazonaws.com";
const path = require("path");
// Take in a userId, return user's visa status
exports.getVisaStatus = async (req, res) => {
  try {
    const userId = req.cookies.user_id;

    // Get one newest uploaded document from documentSchema by userId,
    // and make sure only counting for documentType: "OPT receipt", "OPT EAD", "I-983", "I-20"
    const latestDocument = await Doc.findOne({
      user: userId,
      documentType: { $in: ["OPT_receipt", "OPT_EAD", "I_983", "I_20"] },
    }).sort({ uploadedAt: -1 });

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

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.cookies.user_id; // Extract the user ID from cookies
    const { type } = req.query;
    const file = req.files.file;

    await uploadFile(`${userId}/${type}`, file.data);
    const fileUrl = `${baseUrl}/${userId}/${type}`;

    const newDocument = new Doc({
      user: userId,
      documentType: type,
      fileUrl: fileUrl,
      status: "Pending",
      uploadedAt: new Date(),
    });

    await newDocument.save();
    res.status(200).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading document", error });
  }
};

exports.downloadTemplate = async (req, res) => {
  try {
    const { templateType } = req.params; // 'empty' or 'sample'

    const key = `templates/${templateType}_template.pdf`;
    const downloadPath = path.join(
      __dirname,
      `../downloads/${templateType}_template.pdf`
    );

    console.log(`Downloading file from S3 with key: ${key}`);

    // Download the file from S3 to the local path
    await downloadFile(key, downloadPath);

    // Send the file as a response
    res.download(downloadPath, `${templateType}_template.pdf`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    res.status(500).json({ message: "Error downloading file from S3", error });
  }
};
