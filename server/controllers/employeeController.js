const User = require("../models/userSchema");
const Document = require("../models/documentSchema");
const moment = require("moment");

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
      SSN: 1,
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
      SSN: user.SSN,
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
        message: "No visa-status employees found.",
      });
    }

    const result = await Promise.all(
      visaEmployees.map(async (employee) => {
        // Fetch the employee's pending and rejected documents
        const pendingAndRejectedDocuments = await Document.find({
          user: employee._id,
          status: { $in: ["Pending", "Rejected"] },
        }).select("documentType status fileUrl");

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
          documents: pendingAndRejectedDocuments.map((doc) => ({
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

//Get all visa-status employees with approved documents
const getVisaEmployees = async (req, res) => {
  try {
    const searchQuery = req.query.query || ""; // e.g., ?query=john
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

    // Handle case where no visa-status employees are found
    if (visaEmployees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No visa-status employees found.",
      });
    }

    const result = await Promise.all(
      visaEmployees.map(async (employee) => {
        // Fetch the employee's approved documents
        const approvedDocuments = await Document.find({
          user: employee._id,
          status: "Approved",
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
            status: "Approved",
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

module.exports = {
  getProfile,
  getEmployeesPendingDocs,
  updateDocStatus,
  getVisaEmployees,
};
