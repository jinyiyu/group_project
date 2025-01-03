const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const Document = require("../models/documentSchema");
const TokenHistory = require("../models/tokenHistorySchema");
const { Report } = require("../models/reportSchema");

// Updated generate registration token
exports.generateRegToken = async (req, res) => {
  const { email, fullName } = req.body;
  try {
    const existingUser = await User.findOne({ "userProfile.email": email });
    if (existingUser) {
      const { onboardStatus } = existingUser;
      if (
        ["pending", "approved", "rejected"].includes(
          onboardStatus.toLowerCase()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Cannot generate token. The user with status "${onboardStatus}" is not eligible.`,
        });
      }
    }

    // Generate a registration token (valid for 3 hours)
    const token = jwt.sign({ email, fullName }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    const registrationLink = `http://localhost:5173/user/register/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Token",
      text: `Hi ${fullName}, \n\nPlease use the following registration link to register for your application: ${registrationLink} \nThis link will only last for 3 hours, make sure to register during this time`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to send email.",
          error,
        });
      }

      const newTokenHistory = new TokenHistory({
        email,
        name: fullName,
        registrationLink,
        status: "pending", // Initially marked as pending
      });

      await newTokenHistory.save();

      return res.status(200).json({
        success: true,
        message: "Registration token generated and sent to the email.",
        token,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the registration token.",
      error,
    });
  }
};

// Get token history
exports.getTokenHistory = async (req, res) => {
  try {
    const tokenHistory = await TokenHistory.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      history: tokenHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch token history.",
      error,
    });
  }
};

// Get all onboarding application
exports.getOnboardingApplication = async (req, res) => {
  try {
    const applications = await User.find(
      {},
      {
        "userProfile.firstName": 1,
        "userProfile.lastName": 1,
        "userProfile.email": 1,
        onboardStatus: 1,
      }
    );

    const formattedApplications = applications.map((user) => ({
      user: user._id,
      fullName: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
      email: user.userProfile.email,
      onboardStatus: user.onboardStatus,
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching onboarding applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch onboarding applications.",
    });
  }
};

// Get individual application based on provided user id
exports.getIndividualApplication = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      // .select(
      //   "userProfile.firstName userProfile.lastName userProfile.email onboardStatus feedback"
      // )
      .populate({
        path: "feedback",
        select: "desc createdBy timestamp",
        populate: {
          path: "createdBy",
          select: "userProfile.firstName userProfile.lastName",
        },
      });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const documents = await Document.find({ user: user._id }).select(
      "documentType fileUrl feedback"
    );

    const applicationDetails = {
      user: user._id,
      fullName: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
      email: user.userProfile.email,
      phone: user.contactInfo,
      ssn: user.userProfile.SSN,
      gender: user.userProfile.gender,
      address: user.address,
      onboardStatus: user.onboardStatus,
      form: {
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
        email: user.userProfile.email,
        documents: documents.map((doc) => ({
          title: doc.documentType,
          fileUrl: doc.fileUrl,
          documentFeedback: doc.feedback || "No feedback",
        })),
      },
      // modified feedback
      feedback:
        user.feedback.length > 0 ? user.feedback : "No feedback available",
    };

    res.status(200).json(applicationDetails);
  } catch (error) {
    console.error("Error fetching application:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch application", error });
  }
};

// Give feedback - Having problem with Comment Schema
exports.giveFeedback = async (req, res) => {
  const { userId } = req.params;
  const { description } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.feedback.push(description);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      feedback: description,
    });
  } catch (error) {
    console.error("Error giving feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to give feedback",
      error,
    });
  }
};

// Approve / Reject application
exports.updateApplicationStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, feedback } = req.body;

  try {
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'Approved' or 'Rejected'.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.onboardStatus = status.toLowerCase();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated.",
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status.",
      error,
    });
  }
};

// Get report, just for testing purposes
// exports.getReport = async (req, res) => {
//   try {
//     const report = await Report.find();
//     res.status(200).json(report);
//   } catch (error) {
//     console.error("Error fetching onboarding applications:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch report.",
//     });
//   }
// };

// Get all information of individual user - testing - Hieu Tran
exports.getIndividual = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    const documents = await Document.find({ user: userId }).select(
      "documentType fileUrl feedback"
    );
    res.status(200).json({ user, documents });
  } catch (error) {
    console.error("Error fetching application:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch application", error });
  }
};
