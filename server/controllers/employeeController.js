const User = require("../models/userSchema");
const Document = require("../models/documentSchema");
const { downloadFile } = require("../utils/aws-s3");
const moment = require("moment");
const path = require("path");

// Get all employees' profiles - query is optional for search
const getProfile = async (req, res) => {
  const query = req.query.query;

  // Build the query condition based on whether a search query is provided
  const findCondition = query
    ? {
        $or: [
          { "userProfile.firstName": { $regex: query, $options: "i" } },
          { "userProfile.lastName": { $regex: query, $options: "i" } },
          { "userProfile.preferredName": { $regex: query, $options: "i" } },
        ],
      }
    : {}; // No search query means return all users

  try {
    // Find users based on the constructed condition
    const users = await User.find(findCondition, {
      "userProfile.firstName": 1,
      "userProfile.lastName": 1,
      "userProfile.preferredName": 1,
      "userProfile.email": 1,
      "userProfile.SSN": 1,
      "employment.status": 1,
      "contactInfo.cellPhone": 1,
    });

    // Map users to the desired profile format
    const profiles = users.map((user) => ({
      name: {
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        preferredName: user.userProfile.preferredName,
      },
      SSN: user.userProfile.SSN,
      "Work Authorization Title": user.employment.status,
      "Phone Number": user.contactInfo.cellPhone,
      Email: user.userProfile.email,
    }));

    // Return the profiles
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving employee profiles" });
  }
};

// Get all visa-status employees with the latest documents
const getEmployeesPendingDocs = async (req, res) => {
  try {
    const searchQuery = req.query.query || "";
    const regex = new RegExp(searchQuery, "i");

    // Find visa-status employees only, excluding "GC" and "Citizen"
    const visaEmployees = await User.find({
      "employment.status": { $nin: ["GC", "Citizen"] },
      $or: [
        { "userProfile.firstName": regex },
        { "userProfile.lastName": regex },
        { "userProfile.preferredName": regex },
      ],
    });

    if (visaEmployees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found with pending document.",
      });
    }

    const getLatestDocument = async (employee) => {
      const latestDocument = await Document.findOne({
        user: employee._id,
        documentType: { $in: ["OPT_receipt", "OPT_EAD", "I_983", "I_20"] },
      }).sort({ uploadedAt: -1 });

      return latestDocument;
    };

    const result = await Promise.all(
      visaEmployees.map(async (employee) => {
        const latestDocument = await getLatestDocument(employee);

        const endDate = employee.employment.end;
        const today = moment();
        const daysRemaining = endDate
          ? moment(endDate).diff(today, "days")
          : null;

        let documentInfo;
        if (!latestDocument) {
          documentInfo = "Need to upload OPT-Receipts";
        } else if (
          latestDocument.documentType === "I-20" &&
          latestDocument.status !== "Approved"
        ) {
          documentInfo = "All documents submitted";
        } else {
          documentInfo = {
            documentType: latestDocument.documentType,
            status: latestDocument.status,
            fileUrl: latestDocument.fileUrl,
          };
        }

        return {
          name: {
            firstName: employee.userProfile.firstName,
            lastName: employee.userProfile.lastName,
            preferredName: employee.userProfile.preferredName,
            email: employee.userProfile.email,
          },
          workAuthorizationTitle: {
            title: employee.employment.status,
            start: employee.employment.start,
            end: employee.employment.end,
          },
          daysRemaining: daysRemaining !== null ? daysRemaining : "N/A",
          latestDocument: documentInfo,
        };
      })
    );

    const filteredResult = result.filter(
      (employee) => employee.latestDocument !== "All documents submitted"
    );

    return res.status(200).json({
      success: true,
      data: filteredResult,
    });
  } catch (error) {
    console.error("Error fetching pending documents for employees:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving employee pending documents.",
    });
  }
};

const updateDocStatus = async (req, res) => {
  const { _id, feedback, status } = req.body;

  if (!_id || !status) {
    return res.status(400).json({
      success: false,
      message: "_id and status are required.",
    });
  }

  const validStatuses = ["Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "status must be 'Approved' or 'Rejected'.",
    });
  }

  try {
    // Find the document and update status and feedback if provided
    const updatedDocument = await Document.findByIdAndUpdate(
      _id,
      {
        status: status,
        feedback: feedback || null,
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Visa status updated to ${status}.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the document status.",
    });
  }
};

//Get all visa-status employees with all documents uploaded
const getVisaEmployees = async (req, res) => {
  try {
    const searchQuery = req.query.query || ""; // e.g., ?query=john
    const regex = new RegExp(searchQuery, "i");

    const visaEmployees = await User.find({
      "employment.status": { $nin: ["GC", "Citizen"] },
      $or: [
        { "userProfile.firstName": regex },
        { "userProfile.lastName": regex },
        { "userProfile.preferredName": regex },
      ],
    });

    if (visaEmployees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No visa-status employees found.",
      });
    }

    const result = await Promise.all(
      visaEmployees.map(async (employee) => {
        // Fetch the employee's uploaded documents
        const approvedDocuments = await Document.find({
          user: employee._id,
        }).select("documentType fileUrl");

        const endDate = employee.employment.end;
        const today = moment();
        const daysRemaining = endDate
          ? moment(endDate).diff(today, "days")
          : null;

        return {
          name: {
            firstName: employee.userProfile.firstName,
            lastName: employee.userProfile.lastName,
            preferredName: employee.userProfile.preferredName,
          },
          "Work Authorization Title": {
            title: employee.employment.status,
            start: employee.employment.start,
            end: employee.employment.end,
          },
          daysRemaining: daysRemaining !== null ? daysRemaining : "N/A",
          documents: approvedDocuments.map((doc) => ({
            documentType: doc.documentType,
            status: doc.status,
            fileUrl: doc.fileUrl,
          })),
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching visa-status employees:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving visa employees.",
    });
  }
};

const getDownloadDocument = async (req, res) => {
  //Use this function to retrieve the PDF file from AWS S3.
  // The file path is passed as a query parameter.
  const filePath = req.query.filePath;
  console.log(`Downloading file from S3 with key: ${filePath}`);
  try {
    const key = `documents/documentId/Group_Project.pdf`;
    const downloadPath = path.join(__dirname, `../downloads/testFile.pdf`);

    console.log(`Downloading file from S3 with key: ${key}`);

    // Download the file from S3 to the local path
    await downloadFile(key, downloadPath);

    // Send the file as a response
    res.download(downloadPath, `testFile.pdf`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error downloading document", error });
  }
};

module.exports = {
  getProfile,
  getEmployeesPendingDocs,
  updateDocStatus,
  getVisaEmployees,
  getDownloadDocument,
};
