const User = require("../models/userSchema");
const Doc = require("../models/documentSchema");
const { uploadFile, downloadFile } = require("../utils/aws-s3.js");
const baseUrl = "https://bfgp.s3.amazonaws.com";
const path = require("path");
// Take in a userId, return user's visa status
exports.getVisaStatus = async (req, res) => {
  try {
    // const userId = req.cookies.user_id;
    const userId = "67147b5445846b9bac51d17f";

    // Get one newest uploaded document from documentSchema by userId,
    // and make sure only counting for documentType: "OPT receipt", "OPT EAD", "I_983", "I_20"
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

    // Extract the file extension from the original filename
    const fileExtension = path.extname(file.name); // e.g., '.pdf', '.png', etc.

    // Construct the full file path with dynamic extension
    const fileKey = `${userId}/${type}${fileExtension}`;

    await uploadFile(fileKey, file.data);
    const fileUrl = `${baseUrl}/${fileKey}`;

    const updatedDocument = await Doc.findOneAndUpdate(
      { user: userId, documentType: type },
      {
        $set: {
          fileUrl: fileUrl,
          uploadedAt: Date.now(),
          status: "Pending", // Reset status to "Pending" on file re-upload
        },
      },
      { new: true, upsert: true, lean: true } // Return the updated document, create if doesn't exist
    );

    res.status(200).json({
      message: "Document uploaded successfully",
      document: updatedDocument,
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
